"use client";
import { useGetAiReviewMutation } from "@/redux/submission/submissionApi";
import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  FileOutput,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import LoadingSpinner from "./LoadingSpinner";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import Markdown from "react-markdown";
import AIReviewDialog from "./AIReviewDialog";
import { ScrollArea } from "./ui/scroll-area";

type Props = {
  code: string | undefined;
  problem_name: string;
  problem_statement: string;
  problem_constraints: string;
};

type AIError = {
  status: number;
  data: {
    error: string;
  };
}

const AiCodeReview = ({ code, problem_name, problem_statement, problem_constraints }: Props) => {
  const [aiFeature, setAiFeature] = React.useState<string>("codeReview");
  const [aiReview, setAiReview] = React.useState<string>("");
  const [
    getAIReview,
    { isLoading: isAILoading, isError: isAIError, data: aiData, error: aiError },
  ] = useGetAiReviewMutation();

  const handleAIReview = async () => {
    const aiRequest = {
      code,
      problem_name,
      reviewType: aiFeature,
      problem_statement,
      problem_constraints,
    };

    await getAIReview(aiRequest);
  };

  useEffect(() => {
    if (aiData) {
      setAiReview(aiData.review);
    }
  }, [aiData]);

  return (
    <>
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex gap-3 items-center">
          <Select value={aiFeature} onValueChange={setAiFeature}>
            <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-700 text-white cursor-pointer">
              <SelectValue placeholder="Select AI Feature" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem
                value="codeReview"
                className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>Code Review</span>
                </div>
              </SelectItem>
              <SelectItem
                value="addComment"
                className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <FileOutput className="h-4 w-4" />
                  <span>Add Comments</span>
                </div>
              </SelectItem>
              <SelectItem
                value="optimizedCode"
                className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Optimize Code</span>
                </div>
              </SelectItem>
              <SelectItem
                value="bugFix"
                className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Bug Fix</span>
                </div>
              </SelectItem>
              <SelectItem
                value="provideHints"
                className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Provide Hints</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleAIReview}
            disabled={isAILoading}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white border-0 shadow-lg transition-all duration-200 cursor-pointer"
          >
            {isAILoading ? (
              <>
                <LoadingSpinner size={16} className="mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                AI Review
              </>
            )}
          </Button>
        </div>

        {/* AI Response Display Area */}
        <Card className="bg-slate-950/50 border-slate-700 text-white rounded-sm p-4">
          <CardHeader className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                  <Brain className="h-3 w-3 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">
                    AI Analysis
                  </h4>
                  <p className="text-xs text-slate-400 capitalize">
                    {aiFeature.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
                  AI Powered
                </Badge>
                {aiReview && (
                  <AIReviewDialog
                    aiReview={aiReview}
                    aiFeature={aiFeature}
                  />
                )}
              </div>
            </div>
            <hr />
          </CardHeader>
          <CardContent className="p-0">
            {isAILoading ? (
              <div className="flex flex-col items-center gap-1  justify-center py-8">
                <LoadingSpinner size={24} />
                <p className="text-slate-400 text-sm">
                  AI is analyzing your code...
                </p>
              </div>
            ) : aiReview ? (
              <ScrollArea className="h-80 w-full border border-slate-800 text-slate-300 rounded-sm">
                <div className="prose prose-invert p-3 whitespace-pre-wrap w-[97%]">
                    <Markdown>{aiReview.trim()}</Markdown>
                </div>
              </ScrollArea>
            ) : isAIError ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-3 overflow-auto">
                  <p className="text-slate-400 text-sm">
                    {(aiError as AIError )?.data.error}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-3 overflow-auto">
                  <p className="text-slate-400 text-sm">
                    Review your code with AI powered code review
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AiCodeReview;
