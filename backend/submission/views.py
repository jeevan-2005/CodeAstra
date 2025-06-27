from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import *
from problems.models import *
from accounts.models import *
import os
import uuid
import subprocess


class SaveCodeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user_id = request.query_params.get("user_id")
        problem_id = request.query_params.get("problem_id")
        language = request.query_params.get("language")

        if not user_id or not problem_id or not language:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_instance = CustomUser.objects.get(id=user_id)
            problem_instance = Problem.objects.get(id=problem_id)

            code_obj = CodeSaveModel.objects.get(
                user_id=user_instance, problem_id=problem_instance,
                language=language
            )
            data = {
                "code": code_obj.code,
            }
            return Response(data, status=status.HTTP_200_OK)
        except CodeSaveModel.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):  # sourcery skip: use-named-expression
        code = request.data.get("code")
        user_id = request.data.get("user_id")
        problem_id = request.data.get("problem_id")
        language = request.data.get("language")

        try:
            user_instance = CustomUser.objects.get(id=user_id)
            problem_instance = Problem.objects.get(id=problem_id)
            isPrevCodeExist = CodeSaveModel.objects.filter(
                user_id=user_instance, problem_id=problem_instance, language=language
            ).first()

            if isPrevCodeExist:
                isPrevCodeExist.code = code
                isPrevCodeExist.save()
            else:
                CodeSaveModel.objects.create(user_id=user_instance, problem_id=problem_instance, code=code, language=language)

            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RunCustomTestCaseView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        code = request.data.get("code")
        user_input = request.data.get("user_input")
        language = request.data.get("language")
        
        user_input = user_input.encode("utf-8")

        result = execute_code(code, language, user_input, "bytes", 10)

        if (result["status"] in ["compilation_error", "runtime_error", "invalid_language"]):
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        elif (result["status"] == "internal_error"):
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        elif (result["status"] == "timeout_error"):
            return Response(result, status=status.HTTP_408_REQUEST_TIMEOUT)
        else:
            return Response(result, status=status.HTTP_200_OK)

class SubmitCodeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)
    
    def post(self, request):
        user_id = request.data.get("user_id")
        problem_id = request.data.get("problem_id")
        code = request.data.get("code")
        language = request.data.get("language")

        if(not user_id or not problem_id or not code or not language):
            return Response({
                "verdict": "Invalid request.",
                "details": "All fields are required."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if language not in ["c", "cpp", "py"]:
            return Response({
                "verdict": "Invalid language.",
                "details": "Only 'c', 'cpp' and 'py' languages are supported."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_instance = CustomUser.objects.filter(id=user_id).first()
            problem_instance = Problem.objects.filter(id=problem_id).first()
            test_cases_files = TestCase.objects.filter(problem=problem_instance).first()
            input_file_path = test_cases_files.input_data_file
            output_file_path = test_cases_files.output_data_file
             
            result = execute_code(code, language, input_file_path, "file", 10)

            if result["status"] == "success":
                output = (result["output"])

                with open(output_file_path, "r") as f:
                    expected_output = f.read()

                normalized_output = output.replace('\r\n', '\n')
                normalized_expected_output = expected_output.replace('\r\n', '\n')

                clean_output = normalized_output.strip()
                clean_expected_output = normalized_expected_output.strip()

                if clean_output == clean_expected_output:
                    result["verdict"] = "Accepted"
                else:
                    result["verdict"] = "Wrong Answer"

                SubmissionModel.objects.create(
                    language=language,
                    code=code,
                    user_id=user_instance,
                    problem_id=problem_instance,
                    verdict=result["verdict"]
                )

                return Response({
                    "verdict": result["verdict"],
                    "details": "All test cases passed." if result["verdict"] == "Accepted" else "Test cases failed. Please check your code."
                }, status=status.HTTP_200_OK)
            
            elif (result["status"] in ["compilation_error", "runtime_error", "invalid_language"]):
                if result["status"] == "compilation_error":
                    result["verdict"] = "Compilation Error"
                elif result["status"] == "runtime_error":
                    result["verdict"] = "Runtime Error"
                elif result["status"] == "invalid_language":
                    result["verdict"] = "Invalid Language"
                if result["verdict"] == "Compilation Error" or result["verdict"] == "Runtime Error":
                    SubmissionModel.objects.create(
                        language=language,
                        code=code,
                        user_id=user_instance,
                        problem_id=problem_instance,
                        verdict=result["verdict"]
                    )

                return Response({
                    "verdict": result["verdict"],
                    "details": result["details"]
                }, status=status.HTTP_400_BAD_REQUEST)
            
            elif (result["status"] == "timeout_error"):
                SubmissionModel.objects.create(
                    language=language,
                    code=code,
                    user_id=user_instance,
                    problem_id=problem_instance,
                    verdict="Time Limit Exceeded"
                )
                return Response({
                    "verdict": "Time Limit Exceeded",
                    "details": result["details"]
                }, status=status.HTTP_408_REQUEST_TIMEOUT)
            else:
                return Response({
                    "verdict": result["status"],
                    "details": result["details"]
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Exception as e:
            return Response({
                "verdict": "Internal Server Error",
                "details": str(e)
            },status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def execute_code(code, language, user_input , input_type, timeout_seconds):

    folder_name = "InputCodes"
    curr_dir = os.getcwd()
    folder_path = os.path.join(curr_dir, folder_name)

    os.makedirs(folder_path, exist_ok=True)

    unique_name = uuid.uuid4().hex
    code_file_name = f"{unique_name}.{language}"
    code_file_path = os.path.join(folder_path, code_file_name)
    executable_file_path = None 
    
    result = {
        "status": "internal_error",
        "details": "An unexpected server error occurred."
    }

    try:
        with open(code_file_path, "w", encoding="utf-8") as f:
            f.write(code)

        if language == "c":
            result = cAndCppCompilationAndExecution(folder_path, unique_name, code_file_path, user_input, timeout_seconds, "gcc", input_type)

        elif language == "cpp":
            result = cAndCppCompilationAndExecution(folder_path, unique_name, code_file_path, user_input, timeout_seconds, "g++", input_type)

        elif language == "py":
            try:
                if (input_type == "bytes"):
                    execution_result = subprocess.run(
                        ["python", code_file_path],
                        input=user_input,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        timeout=timeout_seconds
                    )
                else:
                    with open(f"{user_input}", "r") as input_file:
                        execution_result = subprocess.run(
                            ["python", code_file_path],
                            stdin=input_file,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE,
                            timeout=timeout_seconds
                        )
                        
                execution_stdout = execution_result.stdout.decode("utf-8", errors='ignore')
                execution_stderr = execution_result.stderr.decode("utf-8", errors='ignore')
                
                if execution_stderr:
                    result = {
                        "status": "runtime_error",
                        "details": execution_stderr
                    }
                else:
                    result = {
                    "status": "success",
                    "output": execution_stdout
                    }
            except FileNotFoundError:
                result = {
                "status": "internal_error",
                "details": "Python interpreter not found. Is it installed and in PATH?"
                }
            except subprocess.TimeoutExpired:
                result = {
                "status": "timeout_error",
                "details": f"Execution timed out after {timeout_seconds} seconds."
                }


        else:
            result = {
                "status": "invalid_language",
                "details": f"Language '{language}' is not supported."
            }

    except Exception as e:
        result = {
            "status": "internal_error",
            "details": f"An unexpected error occurred during processing: {e}"
        }
    finally:
        if os.path.exists(code_file_path):
            try:
                os.remove(code_file_path)
            except OSError as e:
                print(f"Warning: Could not remove source file {code_file_path}: {e}")

        if executable_file_path and os.path.exists(executable_file_path):
            try:
                os.remove(executable_file_path)
            except OSError as e:
                print(f"Warning: Could not remove executable file {executable_file_path}: {e}")

    return result

def cAndCppCompilationAndExecution(folder_path, unique_name, code_file_path, user_input, timeout_seconds, compiler, input_type):
    executable_file_path = os.path.join(folder_path, unique_name)
    try:
        compilation_res = subprocess.run(
            [compiler, code_file_path, "-o", executable_file_path],
            capture_output=True,
            text=True,
            timeout=timeout_seconds
        )
    except FileNotFoundError:
        result = {
            "status": "internal_error",
            "details": f"{compiler} compiler not found. Is it installed and in PATH?"
        }
        return result
    except subprocess.TimeoutExpired:
        result = {
            "status": "compilation_error",
            "details": f"Compilation timed out after {timeout_seconds} seconds."
        }
        return result


    if compilation_res.returncode != 0:
            result = {
                "status": "compilation_error",
                "details": compilation_res.stderr
            }
    else:
        try:
            if (input_type == "bytes"):
                    execution_result = subprocess.run(
                        ["python", code_file_path],
                        input=user_input,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        timeout=timeout_seconds
                    )
            else:
                with open(f"{user_input}", "r") as input_file:
                    execution_result = subprocess.run(
                        ["python", code_file_path],
                        stdin=input_file,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        timeout=timeout_seconds
                    )

            execution_stdout = execution_result.stdout.decode("utf-8", errors='ignore')
            execution_stderr = execution_result.stderr.decode("utf-8", errors='ignore')

            if execution_stderr:
                result = {
                    "status": "runtime_error",
                    "details": execution_stderr
                }
            else:
                result = {
                "status": "success",
                "output": execution_stdout
                }
        except FileNotFoundError:
            result = {
                "status": "internal_error",
                "details": f"Executable not found after compilation: {executable_file_path}"
            }
        except subprocess.TimeoutExpired:
            result = {
                "status": "timeout_error",
                "details": f"Execution timed out after {timeout_seconds} seconds."
            }
    
    return result