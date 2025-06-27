"use client";

import {
  SingleProblemDetial,
  useGetProblemDetailQuery,
} from "@/redux/problems/problemApi";
import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import ProblemStatement from "./ProblemStatement";
import CodeEditer from "./CodeEditer";
import CustomTestAndSubmission from "./CustomTestAndSubmission";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export interface ProblemFetchError {
  status: number;
  data: {
    detail: string;
  };
}

const ProblemDetial = ({ id }: { id: number }) => {
  const { data, isLoading, isError, error } = useGetProblemDetailQuery({ id });
  const { user } = useSelector((state: RootState) => state.auth);

  const problemData = data as SingleProblemDetial;

  const [code, setCode] = React.useState<string>(
    "// Select a language above and start typing!"
  );

  const [language, setLanguage] = React.useState<string>("cpp");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
        <LoadingSpinner size={40} />
      </div>
    );
  }
  if (isError || !problemData) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-6rem)] text-red-500">
        <h1 className="text-4xl font-bold mb-3">Something went wrong</h1>
        <p className="text-[1.1rem]">
          {(error as ProblemFetchError).data.detail}
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] px-6 pt-6 w-screen flex items-center justify-between gap-3">
      <div className="w-[50%] h-full overflow-auto border p-4 rounded-sm">
        <ProblemStatement
          problem_name={problemData.problem_name}
          problem_statement={problemData.problem_statement}
          test_examples={problemData.test_examples}
          input_format={problemData.input_format}
          output_format={problemData.output_format}
          constraints={problemData.constraints}
        />
      </div>
      <div className="w-[50%] h-full overflow-auto border p-4 flex flex-col gap-4">
        <CodeEditer
          problem_id={id}
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
          user_id={user?.id}
        />
        <CustomTestAndSubmission problem_id={id} code={code} language={language} user_id={user?.id} />
      </div>
    </div>
  );
};

export default ProblemDetial;
