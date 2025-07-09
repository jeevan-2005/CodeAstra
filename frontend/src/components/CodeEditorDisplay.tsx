import { Editor } from "@monaco-editor/react";
import React from "react";

type Props = {
  code: string;
  language: string;
};

const CodeEditorDisplay = ({ code, language }: Props) => {
  const getLanguage = (lang: string) => {
    const languages: Record<string, string> = {
      cpp: "cpp",
      py: "python",
      c: "c",
      java: "java",
    };
    return languages[lang];
  };
  return (
    <div className="border border-slate-800 h-[500px] overflow-auto">
      <Editor
        height="100%"
        language={getLanguage(language)}
        value={code}
        theme="vs-dark"
        options={{
          readOnly: true,
          placeholder: "Write your code here...",
          tabSize: 4,
          suggestOnTriggerCharacters: true,
          wordWrap: "on",
          formatOnPaste: true,
          mouseWheelZoom: true,
          automaticLayout: true,
          fontSize: 14,
          minimap: { enabled: true },
          selectOnLineNumbers: true,
        }}
      />
    </div>
  );
};

export default CodeEditorDisplay;
