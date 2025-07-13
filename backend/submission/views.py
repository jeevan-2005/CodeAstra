from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import *
from problems.models import *
from accounts.models import *
from .utils import execute_code, aiCodeReview
from .serializers import SubmissionSerializer

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

        result = execute_code(code, language, user_input, "bytes")

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
            
            result = execute_code(code, language, input_file_path, "file")
            
            if result["status"] == "success":
                output = (result["output"])

                with open(output_file_path, "r") as f:
                    expected_output = f.read()

                normalized_output = output.replace('\r\n', '\n')
                normalized_expected_output = expected_output.replace('\r\n', '\n')

                def strip_trailing(ws_text: str) -> str:
                    lines = ws_text.split('\n')
                    return "\n".join(line.rstrip() for line in lines)

                clean_output   = strip_trailing(normalized_output).strip()
                clean_expected_output = strip_trailing(normalized_expected_output).strip()

                if clean_output == clean_expected_output:
                    result["verdict"] = "Accepted"
                else:
                    result["verdict"] = "Wrong Answer"

                SubmissionModel.objects.create(
                    language=language,
                    code=code,
                    user_id=user_instance,
                    problem_id=problem_instance,
                    verdict=result["verdict"],
                    time_taken=result["execution_time"],
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
                        verdict=result["verdict"],
                        time_taken=0,
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
                    verdict="Time Limit Exceeded",
                    time_taken=7000 if language == "py" else 2000,
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
                "details": f"{str(e)} - exception"
            },status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AiCodeReview(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code = request.data.get("code") or ""
        problem_statement = request.data.get("problem_statement")
        problem_name = request.data.get("problem_name")
        problem_constraints = request.data.get("problem_constraints")
        reviewType = request.data.get("reviewType")
        language = request.data.get("language") or ""

        try:
            result = aiCodeReview(code, reviewType, problem_statement, problem_name, problem_constraints, language)
            return Response({
                "review": result
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class getUserSubmissions(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id:int):

        try:
            user = CustomUser.objects.filter(id=user_id).first()
            if not user:
                return Response({
                    "error": "User not found"
                }, status=status.HTTP_404_NOT_FOUND)
            submissions = SubmissionModel.objects.filter(user_id=user.id).order_by('-timestamp')
            serializer = SubmissionSerializer(submissions, many=True)
            return Response({"submissions": serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class getUserSubmissionByProblemId(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, user_id:int, problem_name:str):
        try:
            user = CustomUser.objects.filter(id=user_id).first()
            if not user:
                return Response({
                    "error": "User not found"
                }, status=status.HTTP_404_NOT_FOUND)
            
            problem = Problem.objects.filter(problem_name=problem_name).first()
            if not problem:
                return Response({
                    "error": "Problem not found"
                }, status=status.HTTP_404_NOT_FOUND)

            problemSubmission = SubmissionModel.objects.filter(user_id=user.id, problem_id=problem.id).order_by('-timestamp')
            serializer = SubmissionSerializer(problemSubmission, many=True)
            return Response({"submissions": serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)