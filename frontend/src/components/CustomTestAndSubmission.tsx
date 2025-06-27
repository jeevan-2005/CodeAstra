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

type Props = {
  problem_id: number;
  code: string;
  language: string;
  user_id: number | undefined;
};

type CustomTestError = {
  status: number;
  data: object;
};

type SubmitCodeError = {
  status: number;
  data: SubmitCodeData;
};

type SubmitCodeData = {
  verdict: string;
  details: string;
};

type CustomTestErrorData = {
  status: string;
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
    console.log(runCustomTestCaseRequest);
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

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="w-full">
        <Tabs value={tab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger
              value="input"
              className="cursor-pointer mr-1 hover:bg-[#eeebeb]"
              onClick={() => setTab("input")}
            >
              Input
            </TabsTrigger>
            <TabsTrigger
              value="output"
              className="cursor-pointer hover:bg-[#eeebeb]"
              onClick={() => setTab("output")}
            >
              Output
            </TabsTrigger>
            <TabsTrigger
              value="verdict"
              className="cursor-pointer ml-1 hover:bg-[#eeebeb]"
              onClick={() => setTab("verdict")}
            >
              Verdict
            </TabsTrigger>
          </TabsList>
          {isLoading || isSubmitCodeLoading ? (
            <div className="w-full h-[100px] border-3 rounded-sm flex items-center justify-center">
              <LoadingSpinner size={20} />
            </div>
          ) : (
            <>
              <TabsContent value="input">
                <textarea
                  className="w-full h-[100px] border-3 rounded-sm p-2"
                  placeholder="custom input"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                />
              </TabsContent>
              <TabsContent value="output">
                <div className="w-full min-h-[100px] text-wrap border-3 rounded-sm p-2 [white-space:pre-wrap]">
                  {customOutput ? (
                    (customOutput as CustomTestErrorData).status !=
                    "success" ? (
                      <>
                        <p className="text-lg font-medium">
                          {(customOutput as CustomTestErrorData).status}
                        </p>
                        <pre className="text-red-700 whitespace-pre-wrap break-words text-sm">
                          {(customOutput as CustomTestErrorData).details}
                        </pre>
                      </>
                    ) : (
                      (customOutput as CustomTestOutput).output && (
                        <>
                          <pre>{(customOutput as CustomTestOutput).output}</pre>
                        </>
                      )
                    )
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Run the code to see output or errors.
                    </p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="verdict">
                <div className="w-full min-h-[100px] text-wrap border-3 rounded-sm p-2 [white-space:pre-wrap]">
                  {verdict ? (
                    verdict.verdict == "Accepted" ? (
                      <>
                        <p className="text-lg font-medium text-green-600">
                          {verdict.verdict}
                        </p>
                        <pre className="whitespace-pre-wrap break-words text-sm">
                          {verdict.details}
                        </pre>
                      </>
                    ) : verdict.verdict == "Wrong Answer" ? (
                      <>
                        <p className="text-lg font-medium text-red-600">
                          {verdict.verdict}
                        </p>
                        <pre className="text-red-700 whitespace-pre-wrap break-words text-sm">
                          {verdict.details}
                        </pre>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium text-yellow-600">
                          {verdict.verdict}
                        </p>
                        <pre className="whitespace-pre-wrap break-words text-sm">
                          {verdict.details}
                        </pre>
                      </>
                    )
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Submit the code to see verdict.
                    </p>
                  )}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <Button
          className="w-[200px] text-[15px] cursor-pointer"
          onClick={handleRunCode}
          disabled={isLoading}
        >
          {isLoading ? "Running..." : "Run"} <IoPlay />{" "}
        </Button>
        <Button
          className="w-[200px] text-[15px] cursor-pointer"
          variant="destructive"
          onClick={handleCodeSubmit}
          disabled={isSubmitCodeLoading}
        >
          {isSubmitCodeLoading ? "Submitting..." : "Submit"} <FaCircleCheck />
        </Button>
      </div>
    </div>
  );
};

export default CustomTestAndSubmission;
