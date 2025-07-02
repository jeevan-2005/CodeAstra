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
import { Card, CardContent } from "./ui/card";
import { AlertTriangle } from "lucide-react";
import AiCodeReview from "./AiCodeReview";

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size={50} />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }
  if (isError || !problemData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="bg-red-500/10 border-red-500/20 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-red-400 mb-4">
              Something went wrong
            </h1>
            <p className="text-red-300/80 text-lg leading-relaxed">
              {(error as ProblemFetchError)?.data?.detail ||
                "Failed to load problem data"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-min h-[calc(100vh-5rem)] bg-slate-950/97">
      <div className="flex p-3 gap-3">
        {/* Problem Statement Panel */}
        <div className="w-1/2 h-full flex flex-col border border-slate-800 rounded-sm bg-slate-950/50 text-white">
          <div className="flex-1 overflow-auto">
            <div className="p-4">
              <ProblemStatement
                problem_name={problemData.problem_name}
                problem_statement={problemData.problem_statement}
                test_examples={problemData.test_examples}
                input_format={problemData.input_format}
                output_format={problemData.output_format}
                constraints={problemData.constraints}
              />
            </div>
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="w-1/2 h-full flex flex-col rounded-sm">
          <div className="flex-1 p-0 flex flex-col gap-4 rounded-sm">
            <CodeEditer
              problem_id={id}
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              user_id={user?.id}
            />
            <CustomTestAndSubmission
              problem_id={id}
              code={code}
              language={language}
              user_id={user?.id}
            />
            <AiCodeReview
              code={code}
              problem_name={problemData.problem_name}
              problem_statement={problemData.problem_statement}
              problem_constraints={problemData.constraints}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetial;
