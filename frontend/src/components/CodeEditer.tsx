"use client";

import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import Editor from "react-simple-code-editor";

import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-okaidia.css";
import { Button } from "./ui/button";
import { MdSave } from "react-icons/md";

import {
  useGetSavedCodeQuery,
  useSaveCodeMutation,
} from "@/redux/submission/submissionApi";
import LoadingSpinner from "./LoadingSpinner";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <LoadingSpinner size={20} />
      </div>
    );
  }

  if (isError) {
    setLocalError("Something went wrong");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <Button
            disabled={isSavingCode}
            className="cursor-pointer bg-green-600 hover:bg-green-700"
            onClick={handleSaveCode}
          >
            {isSavingCode ? "Saving..." : "Save Code"} <MdSave />
          </Button>
          {localError && <p className="text-red-500">{localError}</p>}
        </div>
        <div className="flex items-center">
          <Label className="mr-4 text-md">Select Language - </Label>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[200px] cursor-pointer">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="py">Python</SelectItem>
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="java">Java</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Editor
          value={code}
          onValueChange={(code) => setCode(code)}
          highlight={(code) => {
            const { grammar, name } = getPrismLanguage(language);
            return Prism.highlight(code, grammar, name);
          }}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            backgroundColor: "#272822",
            height: "350px", // Your fixed height
            overflow: "auto",
            color: "white",
          }}
          padding={15}
        />
      </div>
    </div>
  );
};

export default CodeEditer;
