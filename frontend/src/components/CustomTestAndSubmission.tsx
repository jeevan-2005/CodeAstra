"use client";

import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { IoPlay } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  useRunCustomTestCaseMutation,
  useSubmitCodeMutation,
} from "@/redux/submission/submissionApi";
import LoadingSpinner from "./LoadingSpinner";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileOutput,
  Gavel,
  Play,
  Send,
  Terminal,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

type Props = {
  problem_id: number;
  code: string | undefined;
  language: string;
  user_id: number | undefined;
};

type CustomTestError = {
  status: number;
  data: object;
};
type CustomTestErrorData = {
  status: string;
  details: string;
};

type SubmitCodeError = {
  status: number;
  data: SubmitCodeData;
};

type SubmitCodeData = {
  verdict: string;
  details: string;
};


type CustomTestOutput = {
  status: string;
  output: string;
};

const CustomTestAndSubmission = ({
  problem_id,
  code,
  language,
  user_id,
}: Props) => {
  const [customInput, setCustomInput] = React.useState<string>("");
  const [customOutput, setCustomOutput] = React.useState<object | undefined>(
    undefined
  );
  const [verdict, setVerdict] = React.useState<SubmitCodeData | undefined>(
    undefined
  );
  const [tab, setTab] = React.useState<string>("input");

  const [runCustomTestCase, { isLoading, isError, error, data }] =
    useRunCustomTestCaseMutation();

  const [
    submitCode,
    {
      isLoading: isSubmitCodeLoading,
      isError: isSubmitCodeError,
      error: submitCodeError,
      data: submitResponseData,
    },
  ] = useSubmitCodeMutation();

  const handleRunCode = async () => {
    const runCustomTestCaseRequest = {
      code,
      user_input: customInput,
      language,
    };
    
    await runCustomTestCase(runCustomTestCaseRequest);
    setTab("output");
  };

  const handleCodeSubmit = async () => {
    const submitRequestData = {
      problem_id: problem_id,
      code: code,
      language: language,
      user_id: user_id,
    };
    await submitCode(submitRequestData);
    setTab("verdict");
  };

  useEffect(() => {
    if (data) {
      setCustomOutput(data as CustomTestOutput);
    } else if (isError) {
      setCustomOutput((error as CustomTestError).data as CustomTestErrorData);
    }
  }, [data, isError, error]);

  useEffect(() => {
    if (submitResponseData) {
      setVerdict(submitResponseData);
    } else if (isSubmitCodeError) {
      setVerdict((submitCodeError as SubmitCodeError).data);
    }
  }, [submitResponseData, isSubmitCodeError, submitCodeError]);

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "Accepted":
        return "text-green-400";
      case "Wrong Answer":
        return "text-red-400";
      case "Time Limit Exceeded":
        return "text-yellow-400";
      case "Runtime Error":
        return "text-orange-400";
      default:
        return "text-slate-400";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "Accepted":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "Wrong Answer":
        return <XCircle className="h-5 w-5 text-red-400" />;
      case "Time Limit Exceeded":
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case "Runtime Error":
        return <AlertTriangle className="h-5 w-5 text-orange-400" />;
      default:
        return <Gavel className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 p-2 rounded-sm gap-4">
      <CardHeader className="p-0 mt-2">
        <CardTitle className="text-lg text-white flex items-center space-x-2">
          <Terminal className="h-5 w-5 text-blue-400" />
          <span>Test & Submit</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 p-0">
        <Tabs value={tab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
            <TabsTrigger
              value="input"
              onClick={() => setTab("input")}
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <Terminal className="h-4 w-4 mr-2" />
              Input
            </TabsTrigger>
            <TabsTrigger
              value="output"
              onClick={() => setTab("output")}
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <FileOutput className="h-4 w-4 mr-2" />
              Output
            </TabsTrigger>
            <TabsTrigger
              value="verdict"
              onClick={() => setTab("verdict")}
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <Gavel className="h-4 w-4 mr-2" />
              Verdict
            </TabsTrigger>
          </TabsList>

          {isLoading || isSubmitCodeLoading ? (
            <Card className="bg-slate-950/50 border-slate-700 mt-1">
              <CardContent className="flex flex-col items-center justify-center h-32 gap-1.5">
                  <LoadingSpinner size={24} />
                  <p className="text-slate-400 text-sm">
                    {isLoading
                      ? "Running your code..."
                      : "Submitting solution..."}
                  </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <TabsContent value="input" className="mt-1">
                <Card className="bg-slate-950/50 border-slate-700 p-2 rounded-sm">
                  <CardContent className="p-0 min-h-28">
                    <textarea
                      className="w-full h-26 bg-transparent border-0 text-slate-300 placeholder:text-slate-500 p-1 resize-none focus:outline-none font-mono text-sm"
                      placeholder="Enter your custom input here..."
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="output" className="mt-1">
                <Card className="bg-slate-950/50 border-slate-700 p-2 rounded-sm">
                  <CardContent className="p-0 min-h-28">
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
                      <div className="flex items-center justify-center h-20 text-slate-500">
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
              </TabsContent>

              <TabsContent value="verdict" className="mt-1">
                <Card className="bg-slate-950/50 border-slate-700 p-2 rounded-sm">
                  <CardContent className="p-0 min-h-28">
                    {verdict ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          {getVerdictIcon(verdict.verdict)}
                          <div>
                            <h3
                              className={`text-lg font-semibold ${getVerdictColor(
                                verdict.verdict
                              )}`}
                            >
                              {verdict.verdict}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              Submission Result
                            </p>
                          </div>
                        </div>
                        <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
                          <pre className="text-slate-300 whitespace-pre-wrap break-words text-sm font-mono">
                            {verdict.details}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-20 text-slate-500">
                        <div className="text-center space-y-2">
                          <Gavel className="h-8 w-8 mx-auto text-slate-600" />
                          <p className="text-sm">
                            Submit your code to see the verdict
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-3 border-t border-slate-800">
          <Button
            onClick={handleRunCode}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg transition-all duration-200 cursor-pointer"
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

          <Button
            onClick={handleCodeSubmit}
            disabled={isSubmitCodeLoading}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white border-0 shadow-lg transition-all duration-200 cursor-pointer"
          >
            {isSubmitCodeLoading ? (
              <>
                <LoadingSpinner size={16} className="mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Solution
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomTestAndSubmission;
