import os
import uuid
import subprocess
from pathlib import Path
from google import genai
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, ".env"))
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY)

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

def getPrompt(reviewType):
    
    if reviewType == "codeReview":
        return "As an AI Code Reviewer, please provide a comprehensive code review for the following code. Focus on best practices, potential improvements, readability, efficiency, and any notable issues. Present your findings as clear suggestions with brief explanations:\n\n"
    elif reviewType == "addComment":
        return "As an AI assistant, please analyze the following code and add appropriate comments to improve its readability and clarity. Focus on explaining complex sections, functions, or overall logic. Provide the code with comments added:\n\n"
    elif reviewType == "optimizedCode":
        return "As an AI assistant, please analyze the following code and provide an optimized version. Explain the specific areas that were optimized and the benefits of the changes (e.g., performance, memory, readability). Provide the optimized code snippet:\n\n"
    elif reviewType == "bugFix":
        return "As an AI assistant, please analyze the following code to identify potential bugs. If bugs are found, provide the corrected code along with an explanation of the bug and how the fix resolves it:\n\n"
    elif reviewType == "provideHints":
        return "As an AI assistant focused on guiding learning, please provide *just one* helpful hint related to the following problem it addresses and the constraints provided in the problem. This hint should guide the user towards a solution or improvement without giving it away entirely. Provide only the hint:\n\n"
    
    return



def aiCodeReview(code, reviewType, problem_statement, problem_name, problem_constraints):
    basePrompt = getPrompt(reviewType=reviewType)

    if reviewType == "provideHints":
        prompt = basePrompt + problem_name + problem_statement + problem_constraints
    else:
        prompt = problem_name + problem_statement + problem_constraints + basePrompt + code
    
    
    response = client.models.generate_content(
        model="gemini-2.0-flash", 
        contents={prompt},
    )
    return response.text