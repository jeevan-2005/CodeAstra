import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { File } from "lucide-react";
import { Badge } from "./ui/badge";
import { useGetAiReviewMutation } from "@/redux/submission/submissionApi";
import CodeEditorDisplay from "./CodeEditorDisplay";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  problem_name: string;
  problem_statement: string;
  problem_constraints: string;
  language: string;
};
type AIError = {
  status: number;
  data: {
    error: string;
  };
};

const GetBiolerPlate = ({
  problem_name,
  language,
  problem_statement,
  problem_constraints,
}: Props) => {
  const [code, setCode] = React.useState<string>("");
  const [getAiReview, { isLoading, isError, data: AiBoilerplateCode, error }] =
    useGetAiReviewMutation();

  const handleAIReview = async () => {
    const aiRequest = {
      problem_name,
      reviewType: "getBoilerPateCode",
      problem_statement,
      problem_constraints,
      language,
    };
    await getAiReview(aiRequest);
  };

  useEffect(() => {
    if (AiBoilerplateCode) {
      setCode(AiBoilerplateCode.review);
    }
  }, [AiBoilerplateCode]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-xl px-4 py-2 text-sm cursor-pointer rounded-sm"
          onClick={handleAIReview}
          disabled={isLoading}
        >
          <File className="h-4 w-4" />{" "}
          {isLoading ? "Generating..." : "Get Boilerplate Code"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] !max-w-[70vw] w-full bg-slate-900 border-slate-800 text-white pt-8">
        <DialogHeader className="border-b border-slate-800 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DialogTitle className="text-xl font-bold text-white">
                Boilerplate Code for Problem - {problem_name}
              </DialogTitle>
              <div>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 font-medium">
                  {language.toLowerCase()}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[300px] w-full gap-1">
            <LoadingSpinner size={30} />
            <p className="text-slate-400">Generating...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-[300px] w-full gap-1">
            <p className="text-slate-400">
              Error: {(error as AIError).data.error || "Something went wrong"}
            </p>
          </div>
        ) : (
          <CodeEditorDisplay code={code} language={language} />
        )}

      </DialogContent>
    </Dialog>
  );
};

export default GetBiolerPlate;
