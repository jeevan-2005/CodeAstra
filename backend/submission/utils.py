import os
import uuid
import subprocess
from pathlib import Path
from google import genai
from dotenv import load_dotenv
import time
import re

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, ".env"))
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY)

def is_cin_used_as_input(filepath):
    try:
        with open(filepath, 'r') as file:
            content = file.read()

            # comments (/* ... */)
            clean_content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)

            # comments (// ...)
            clean_content = re.sub(r'//.*', '', clean_content)

            # string literals ("...")
            clean_content = re.sub(r'".*?"', '', clean_content)

            # searching in clean code.
            pattern = r"(?:std::\s*)?cin\s*>>"
            if re.search(pattern, clean_content):
                return True
            else:
                return False

    except FileNotFoundError:
        print(f"Error: The file '{filepath}' was not found.")
        return False

def execute_code(code, language, user_input , input_type):

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
            result = cAndCppCompilationAndExecution(folder_path, unique_name, code_file_path, user_input, 2, "gcc", input_type)
            executable_file_path = os.path.join(folder_path, unique_name)

        elif language == "cpp":
            result = cAndCppCompilationAndExecution(folder_path, unique_name, code_file_path, user_input, 2, "g++", input_type)
            executable_file_path = os.path.join(folder_path, unique_name)

        elif language == "py":
            try:
                start_time = time.monotonic()
                if (input_type == "bytes"):
                    execution_result = subprocess.run(
                        ["python", code_file_path],
                        input=user_input,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        timeout=7
                    )
                else:
                    with open(f"{user_input}", "r") as input_file:
                        execution_result = subprocess.run(
                            ["python", code_file_path],
                            stdin=input_file,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE,
                            timeout=7
                        )

                end_time = time.monotonic()
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
                    "output": execution_stdout,
                    "execution_time": int((end_time - start_time)*1000)
                    }
            except FileNotFoundError:
                result = {
                "status": "internal_error",
                "details": "Python interpreter not found. Is it installed and in PATH?"
                }
            except subprocess.TimeoutExpired:
                result = {
                "status": "timeout_error",
                "details": f"Execution timed out after {1 if language in ['c', 'cpp'] else 7} seconds."
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

        if os.path.exists(folder_path):
            try:
                os.rmdir(folder_path)
            except OSError as e:
                print(f"Warning: Could not remove folder {folder_path}: {e}")

    return result

def cAndCppCompilationAndExecution(folder_path, unique_name, code_file_path, user_input, timeout_seconds, compiler, input_type):
    executable_file_path = os.path.join(folder_path, unique_name)
    try:
        compilation_res = subprocess.run(
            [compiler, code_file_path, "-o", executable_file_path],
            capture_output=True,
            text=True,
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
    

    # Basedir = os.getcwd()
    # os.chdir(os.path.join(Basedir, "InputCodes"))
    
    if compilation_res.returncode != 0:
            result = {
                "status": "compilation_error",
                "details": compilation_res.stderr
            }
    else:
        if (is_cin_used_as_input(code_file_path) and input_type == "bytes" and user_input == b''):
            # os.chdir(Basedir)
            return {
                "status": "runtime_error",
                "details": "Program is reading input from standard input and you forgot to provide input via stdin."
            }
        try:
            start_time = time.monotonic()
            if (input_type == "bytes"):
                execution_result = subprocess.run(
                    [f"{executable_file_path}"],
                    input=user_input,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    timeout=timeout_seconds
                )
            else:
                print(1, user_input)    
                with open(f"{user_input}", "r") as input_file:
                    print(1)
                    print(input_file)
                    execution_result = subprocess.run(
                        [f"{executable_file_path}"],
                        stdin=input_file,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        timeout=timeout_seconds
                    )
            end_time = time.monotonic()
            
            execution_stdout = execution_result.stdout.decode("utf-8", errors='ignore')
            execution_stderr = execution_result.stderr.decode("utf-8", errors='ignore')
            
            if execution_result.returncode != 0:
                details = execution_stderr
                if not details:
                    details = f"""Process exited with non-zero return code: {execution_result.returncode}
                    Possible reasons:
                    1. If your program is reading input from standard input and you forgot to provide input via stdin.
                    2. Your program contains infinite recursive function calls.
                    3. May be your program is trying to process large data and it takes much time to process"""
                    
                result = {
                    "status": "runtime_error",
                    "details": details
                }
            elif execution_stderr:
                 result = {
                    "status": "runtime_error",
                    "details": execution_stderr
                }
            else:
                result = {
                    "status": "success",
                    "output": execution_stdout,
                    "execution_time": int((end_time - start_time)*1000)
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
    # os.chdir(Basedir)
    
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
    elif reviewType=="getBoilerPateCode":
        return "As an AI assistant, please generate a boilerplate code for the following problem and language specified. Focus on readability, efficiency, and any notable issues.Please use variable names that are easy to understand and suitable for the problem.Please do not add any type of Key improvements and explanations section and please keep minimal comments, add only if neccessary. Dont give complete solution code just give the function and its respective calling with input taking part. Please Provide the starte so that the user can start coding on the problem:\n\n"
    
    return

def aiCodeReview(code, reviewType, problem_statement, problem_name, problem_constraints, language):
    basePrompt = getPrompt(reviewType=reviewType)
    codeLanguage = f"provide Boilerplate code in {language} language:"
    if reviewType == "provideHints":
        prompt = basePrompt + problem_name + problem_statement + problem_constraints
    elif reviewType == "getBoilerPateCode":
        prompt = basePrompt + problem_name + problem_statement + problem_constraints + codeLanguage
    else:
        prompt = problem_name + problem_statement + problem_constraints + basePrompt + code
    
    
    response = client.models.generate_content(
        model="gemini-2.0-flash", 
        contents={prompt},
    )
    return response.text