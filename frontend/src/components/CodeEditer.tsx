"use client";

import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Editor from "react-simple-code-editor";

import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-okaidia.css";
import { Button } from "./ui/button";

import {
  useGetSavedCodeQuery,
  useSaveCodeMutation,
} from "@/redux/submission/submissionApi";
import LoadingSpinner from "./LoadingSpinner";
import { Card, CardContent, CardHeader } from "./ui/card";
import { AlertCircle, Code2, Save, Settings } from "lucide-react";
import { Badge } from "./ui/badge";

type Props = {
  problem_id: number;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  user_id: number | undefined;
};

const CodeEditer = ({
  problem_id,
  code,
  setCode,
  language,
  setLanguage,
  user_id
}: Props) => {

  const [localError, setLocalError] = React.useState<string | null>(null);
  const queryParams = React.useMemo(
    () => ({
      problem_id,
      user_id: user_id,
      language,
    }),
    [problem_id, user_id, language]
  );

  const {
    data,
    isLoading,
    isError: getSaveCodeError,
  } = useGetSavedCodeQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const [saveCode, { isLoading: isSavingCode, isError }] =
    useSaveCodeMutation();

  useEffect(() => {
    if (data) {
      if (!data.code) {
        setCode("");
      } else {
        setCode(JSON.parse(data.code));
      }
    }
    if (getSaveCodeError) {
      setCode("");
    }
  }, [data, getSaveCodeError, setCode]);

  const getPrismLanguage = (langKey: string) => {
    switch (langKey) {
      case "c":
        return { grammar: Prism.languages.c, name: "c" };
      case "cpp":
        return { grammar: Prism.languages.cpp, name: "cpp" };
      case "python":
        return { grammar: Prism.languages.python, name: "python" };
      case "java":
        return { grammar: Prism.languages.java, name: "java" };
      default:
        return { grammar: Prism.languages.clike || {}, name: "clike" };
    }
  };

  const handleSaveCode = async () => {
    const stringified_code = JSON.stringify(code);
    const data = {
      code: stringified_code,
      language: language,
      problem_id: problem_id,
      user_id: user_id,
    };

    await saveCode(data);
  };

  const getLanguageIcon = (lang: string) => {
    const icons: Record<string, string> = {
      cpp: "C++",
      py: "Python",
      c: "C",
      java: "Java",
    }
    return icons[lang] || "CODE"
  }

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      cpp: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      py: "bg-green-500/10 text-green-400 border-green-500/20",
      c: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      java: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    }
    return colors[lang] || "bg-slate-500/10 text-slate-400 border-slate-500/20"
  }

  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-slate-800 h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <LoadingSpinner size={32} />
            <p className="text-slate-400">Loading your code...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    setLocalError("Something went wrong");
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800 h-full flex flex-col p-2 rounded-sm gap-4">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Code2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Code Editor</h3>
              <p className="text-sm text-slate-400">Write your solution here</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge className={getLanguageColor(language)}>{getLanguageIcon(language)}</Badge>
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-slate-400" />
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700 text-white cursor-pointer">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  <SelectItem value="cpp" className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer">
                    C++
                  </SelectItem>
                  <SelectItem value="py" className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer">
                    Python
                  </SelectItem>
                  <SelectItem value="c" className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer">
                    C
                  </SelectItem>
                  <SelectItem value="java" className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer">
                    Java
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <Button
              disabled={isSavingCode}
              onClick={handleSaveCode}
              className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white border-0 shadow-lg transition-all duration-200 cursor-pointer"
            >
              {isSavingCode ? (
                <>
                  <LoadingSpinner size={16} className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Code
                </>
              )}
            </Button>

            {localError && (
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{localError}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 text-slate-400 text-sm">
            <span>Lines: {code.split("\n").length}</span>
            <span>•</span>
            <span>Characters: {code.length}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 h-full">
        <div className="border-t border-slate-800 h-[400px] overflow-auto">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) => {
              const { grammar, name } = getPrismLanguage(language)
              return Prism.highlight(code, grammar, name)
            }}
            style={{
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
              fontSize: 13,
              backgroundColor: "#0f172a", // slate-950
              minHeight: "395px",
              width: "100%",
              color: "#e2e8f0", // slate-200
              outline: "none",
              border: "none",
              lineHeight: 1.6,
            }}
            padding={20}
            placeholder="// Start coding here..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeEditer;
