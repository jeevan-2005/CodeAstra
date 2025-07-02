import React from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Code,
  Calendar,
  Eye,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Submission } from "@/redux/submission/submissionApi";
import Link from "next/link";

type Props = {
  submissions: Submission[];
  problemSlug?: string;
};

const SubmissionTable = ({ submissions, problemSlug }: Props) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  };

  // Get verdict styling
  const getVerdictStyling = (verdict: string) => {
    switch (verdict) {
      case "Accepted":
        return {
          className: "bg-green-500/10 text-green-400 border-green-500/20",
          icon: <CheckCircle className="h-3 w-3" />,
        };
      case "Wrong Answer":
        return {
          className: "bg-red-500/10 text-red-400 border-red-500/20",
          icon: <XCircle className="h-3 w-3" />,
        };
      case "Time Limit Exceeded":
        return {
          className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
          icon: <Clock className="h-3 w-3" />,
        };
      case "Runtime Error":
        return {
          className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
          icon: <AlertTriangle className="h-3 w-3" />,
        };
      case "Compilation Error":
        return {
          className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
          icon: <Code className="h-3 w-3" />,
        };
      case "Memory Limit Exceeded":
        return {
          className: "bg-pink-500/10 text-pink-400 border-pink-500/20",
          icon: <AlertTriangle className="h-3 w-3" />,
        };
      default:
        return {
          className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
          icon: <FileText className="h-3 w-3" />,
        };
    }
  };

  // Get language styling
  const getLanguageStyling = (language: string) => {
    switch (language.toLowerCase()) {
      case "python":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "cpp":
      case "c++":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "java":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "c":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "javascript":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };
  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              My{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Submissions
              </span>
              {problemSlug && (
                <>
                  {" "}
                  for{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    {problemSlug} Problem
                  </span>
                </>
              )}
            </h1>
            <p className="text-slate-400 text-lg">
              Track your coding progress and submission history
            </p>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-400" />
            <span>Submission History</span>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 ml-2">
              {submissions ? submissions.length : 0} results
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          <div className="overflow-x-auto scrollbar-webkit">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/30">
                  <TableHead className="text-slate-300 font-semibold w-16 pl-5">
                    S.No
                  </TableHead>
                  <TableHead className="text-slate-300 font-semibold">
                    Problem Name
                  </TableHead>
                  <TableHead className="text-slate-300 font-semibold w-75">
                    Verdict
                  </TableHead>
                  <TableHead className="text-slate-300 font-semibold w-25">
                    Language
                  </TableHead>
                  <TableHead className="text-slate-300 font-semibold w-40">
                    Submitted At
                  </TableHead>
                  <TableHead className="text-slate-300 font-semibold w-45">
                    Performance
                  </TableHead>
                  <TableHead className="text-slate-300 font-semibold w-16 pr-5">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions && (submissions as Submission[]).length > 0 ? (
                  submissions.map((submission, index) => {
                    const verdictStyling = getVerdictStyling(
                      submission.verdict
                    );
                    const { date, time } = formatTimestamp(
                      submission.timestamp
                    );

                    return (
                      <TableRow
                        key={submission.id}
                        className="border-slate-800 hover:bg-slate-800/50 transition-all duration-200 group"
                      >
                        <TableCell className="py-4 pl-5">
                          <div className="font-mono text-slate-400 text-sm">
                            #{String(index + 1).padStart(3, "0")}
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <Link
                            href={`/problems/${submission.problem_id}`}
                            className="font-medium text-white hover:text-blue-400 transition-colors cursor-pointer"
                          >
                            {submission.problem_name}
                          </Link>
                        </TableCell>

                        <TableCell className="py-4">
                          <Badge
                            className={`${verdictStyling.className} font-medium flex items-center space-x-1`}
                          >
                            {verdictStyling.icon}
                            <span>{submission.verdict}</span>
                          </Badge>
                        </TableCell>

                        <TableCell className="py-4">
                          <Badge
                            className={`${getLanguageStyling(
                              submission.language
                            )} font-medium`}
                          >
                            {submission.language.toLowerCase()}
                          </Badge>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="text-white text-sm font-medium flex items-center space-x-1">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              <span>{date}</span>
                            </div>
                            <div className="text-slate-400 text-xs font-mono">
                              {time}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="text-slate-300 text-xs">
                              <span className="text-slate-400">Time:</span>{" "}
                              {"-----"}
                            </div>
                            <div className="text-slate-300 text-xs">
                              <span className="text-slate-400">Memory:</span>{" "}
                              {"-----"}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center border-slate-800"
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <FileText className="h-12 w-12 text-slate-600" />
                        <div className="space-y-1">
                          <p className="text-slate-400 font-medium">
                            No submissions found
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionTable;
