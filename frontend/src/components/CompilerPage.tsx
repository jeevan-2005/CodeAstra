"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Code2,
  Palette,
  Terminal,
  FileOutput,
  XCircle,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useRunCustomTestCaseMutation } from "@/redux/submission/submissionApi";
import LoadingSpinner from "./LoadingSpinner";

// Language configurations

type LanguageConfig = {
  name: string;
  defaultCode: string;
  extension: string;
  color: string;
};

type EditorThemeConfig = {
  name: string;
  description: string;
  color: string;
};
type CustomTestOutput = {
  status: string;
  output: string;
};
type CustomTestError = {
  status: number;
  data: object;
};
type CustomTestErrorData = {
  status: string;
  details: string;
};

const LANGUAGES: Record<string, LanguageConfig> = {
  cpp: {
    name: "C++",
    defaultCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    extension: "cpp",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  py: {
    name: "Python",
    defaultCode: `print("Hello, World!")`,
    extension: "py",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  java: {
    name: "Java",
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    extension: "java",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  c: {
    name: "C",
    defaultCode: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
    extension: "c",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
};

// Editor themes
const EDITOR_THEMES: Record<string, EditorThemeConfig> = {
  "vs-dark": {
    name: "Dark",
    description: "Default dark theme",
    color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
  light: {
    name: "Light",
    description: "Light theme",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  "hc-black": {
    name: "High Contrast",
    description: "High contrast dark theme",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
};

const CompilerPage = () => {
  const [language, setLanguage] = useState<string>("cpp");
  const [theme, setTheme] = useState<string>("vs-dark");
  const [code, setCode] = useState<string | undefined>(
    LANGUAGES.cpp.defaultCode
  );
  const [input, setInput] = useState("");
  const [customOutput, setCustomOutput] = useState<object | undefined>(
    undefined
  );

  const [runCustomTestCase, { isLoading, isError, error, data }] =
    useRunCustomTestCaseMutation();

  // Handle language change
  const handleLanguageChange = (newLanguage: keyof typeof LANGUAGES) => {
    setLanguage(newLanguage);
    setCode(LANGUAGES[newLanguage].defaultCode);
  };

  const getLanguage = (lang: string) => {
    const languages: Record<string, string> = {
      cpp: "cpp",
      py: "python",
      c: "c",
      java: "java",
    };
    return languages[lang];
  };

  // Handle code execution
  const handleRunCode = async () => {
    const runCustomTestCaseRequest = {
      code,
      user_input: input,
      language,
    }
    console.log(runCustomTestCaseRequest);
    await runCustomTestCase(runCustomTestCaseRequest);
  };

  useEffect(() => {
    if (data) {
      setCustomOutput(data as CustomTestOutput);
    } else if (isError) {
      setCustomOutput((error as CustomTestError).data as CustomTestErrorData);
    }
  }, [data, isError, error]);

  return (
    <div className="h-[calc(100vh-4.6rem)] bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Code{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Compiler
                  </span>
                </h1>
                <p className="text-slate-400 text-sm">
                  Write, compile, and run your code online
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <Code2 className="h-4 w-4 text-slate-400" />
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700 text-white cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800">
                    {Object.entries(LANGUAGES).map(([key, lang]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        disabled={key == "java"}
                        className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer"
                      >
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-slate-400" />
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-[160px] bg-slate-800/50 border-slate-700 text-white cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800">
                    {Object.entries(EDITOR_THEMES).map(([key, themeInfo]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer"
                      >
                        {themeInfo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleRunCode}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white border-0 shadow-lg cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size={16} className="mr-2" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Half - Code Editor */}
        <div className="w-1/2 border-r border-slate-800 flex flex-col h-[570px] p-2">
          {/* Monaco Editor */}
          <div className="h-full">
            <Editor
              height="100%"
              language={getLanguage(language)}
              value={code}
              onChange={(value) => setCode(value)}
              theme={theme}
              options={{
                tabSize: 4,
                suggestOnTriggerCharacters: true,
                wordWrap: "on",
                formatOnPaste: true,
                mouseWheelZoom: true,
                automaticLayout: true,
                fontSize: 14,
                minimap: { enabled: true },
                selectOnLineNumbers: true,
                scrollBeyondLastLine: false,
                renderLineHighlight: "all",
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                contextmenu: true,
                quickSuggestions: true,
                parameterHints: { enabled: true },
                folding: true,
                lineNumbers: "on",
                glyphMargin: true,
                rulers: [80, 120],
              }}
            />
          </div>
        </div>

        {/* Right Half - Input/Output */}
        <div className="w-1/2 flex flex-col">
          {/* Input Section (Top Half) */}
          <div className="h-1/2 border-b border-slate-800 flex flex-col">
            <div className="bg-slate-900/30 border-b border-slate-800 p-2 px-5">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-blue-400" />
                <h3 className="text-white font-semibold">Input</h3>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                  stdin
                </Badge>
              </div>
            </div>
            <div className="flex-1 p-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your input here..."
                className="w-full h-full bg-slate-950/50 border border-slate-700 rounded-lg p-4 text-slate-300 placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-mono text-sm scrollbar-webkit"
              />
            </div>
          </div>

          {/* Output Section (Bottom Half) */}
          <div className="h-1/2 border-b border-slate-800 flex flex-col">
            <div className="bg-slate-900/30 border-b border-slate-800 p-2 px-5">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-blue-400" />
                <h3 className="text-white font-semibold">Output</h3>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                  stdout
                </Badge>
              </div>
            </div>
            {isLoading ? (
              <div className="p-4">
                <Card className="bg-slate-950/50 border-slate-700 p-4">
                <CardContent className="flex flex-col items-center justify-center h-44 gap-2">
                  <LoadingSpinner size={24} className="text-white" />
                  <p className="text-slate-400 text-sm">Running your code...</p>
                </CardContent>
              </Card>
              </div>
            ) : (
              <div className="p-4">
                <Card className="bg-slate-950/50 border-slate-700 p-3 rounded-sm overflow-auto">
                  <CardContent className="p-0 max-h-46">
                    {customOutput ? (
                      (customOutput as CustomTestErrorData).status !==
                      "success" ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <XCircle className="h-5 w-5 text-red-400" />
                            <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                              {(customOutput as CustomTestErrorData).status}
                            </Badge>
                          </div>
                          <pre className="text-red-300 whitespace-pre-wrap break-words text-sm font-mono bg-red-500/5 p-3 rounded border border-red-500/20">
                            {(customOutput as CustomTestErrorData).details}
                          </pre>
                        </div>
                      ) : (
                        (customOutput as CustomTestOutput).output && (
                          <div className="space-y-2">
                            <pre className="text-green-300 whitespace-pre-wrap font-mono text-sm p-1">
                              {(customOutput as CustomTestOutput).output}
                            </pre>
                          </div>
                        )
                      )
                    ) : (
                      <div className="flex items-center justify-center h-46 text-slate-500">
                        <div className="text-center space-y-2">
                          <FileOutput className="h-8 w-8 mx-auto text-slate-600" />
                          <p className="text-sm">
                            Run your code to see the output
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompilerPage;
