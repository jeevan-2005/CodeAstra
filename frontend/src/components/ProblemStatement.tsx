import { TestExample } from "@/redux/problems/problemApi";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowRight, CheckCircle, FileText, Play } from "lucide-react";
import { Badge } from "./ui/badge";
import Link from "next/link";

type Props = {
  problem_name: string;
  problem_statement: string;
  test_examples: TestExample[];
  input_format: string;
  output_format: string;
  constraints: string;
};

const ProblemStatement = ({
  problem_name,
  problem_statement,
  test_examples,
  input_format,
  output_format,
  constraints,
}: Props) => {
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center ml-1 space-x-3">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">{problem_name}</h1>
          </div>
          <div>
            <Link href={`/problems/submissions/${problem_name}`}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-xl px-4 py-2 text-sm cursor-pointer rounded-sm"
            >My Submissions</Link>
          </div>
        </div>

        <Card className="bg-slate-950/50 border-none p-0">
          <CardContent className="p-4">
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 text-md leading-relaxed whitespace-pre-wrap">
                {problem_statement}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input Format */}
      <Card className="bg-slate-900/50 border-slate-800 p-3 gap-2 ">
        <CardHeader className="p-0 m-0">
          <CardTitle className="text-lg text-white flex items-center space-x-2">
            <ArrowRight className="h-4 w-4 text-blue-400" />
            <span>Input Format</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 m-0">
          <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
            {input_format}
          </p>
        </CardContent>
      </Card>

      {/* Output Format */}
      <Card className="bg-slate-900/50 border-slate-800 p-3 gap-2">
        <CardHeader className="p-0">
          <CardTitle className="text-lg text-white flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>Output Format</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
            {output_format}
          </p>
        </CardContent>
      </Card>

      {/* Constraints */}
      <Card className="bg-slate-900/50 border-slate-800 p-3 gap-2">
        <CardHeader className="p-0">
          <CardTitle className="text-lg text-white flex items-center space-x-2">
            <div className="w-4 h-4 rounded border-2 border-yellow-400 flex items-center justify-center">
              <div className="w-1 h-1 bg-yellow-400 rounded-full" />
            </div>
            <span>Constraints</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-2">
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
              {constraints}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Test Examples */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 mt-5">
          <Play className="h-4 w-4 text-purple-400" />
          <h2 className="text-lg text-white">Test Examples</h2>
        </div>

        <div className="grid gap-2">
          {test_examples.map((testExample, index) => (
            <Card
              key={testExample.id}
              className="bg-slate-900/50 border-slate-800 p-3 gap-2"
            >
              <CardHeader className="p-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white flex items-center space-x-2">
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                      Example {index + 1}
                    </Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-2">
                {/* Input */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4 text-blue-400" />
                    <span className="font-semibold text-blue-400">Input</span>
                  </div>
                  <Card className="bg-slate-950/50 border-slate-700 p-3 px-4">
                    <CardContent className="p-0">
                      <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                        {testExample.input_data}
                      </pre>
                    </CardContent>
                  </Card>
                </div>

                {/* Output */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="font-semibold text-emerald-400">
                      Output
                    </span>
                  </div>
                  <Card className="bg-slate-950/50 border-slate-700 p-3 px-4">
                    <CardContent className="p-0">
                      <pre className="text-cyan-400 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                        {testExample.output_data}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemStatement;
