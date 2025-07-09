"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Code, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw } from "lucide-react"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import LoadingSpinner from "./LoadingSpinner"
import { useEffect, useState } from "react"
import { Submission, useGetUserSubmissionsQuery, UserSubmissionsResponse } from "@/redux/submission/submissionApi"

const ProfilePage = () => {
    const user = useSelector((state: RootState) => state.auth.user);
  const firstLetter = user && user.username.charAt(0).toUpperCase()

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { data, isLoading, isError, refetch } = useGetUserSubmissionsQuery(
    user?.id
  );
  useEffect(() => {
    if (data) {
      const newSubmissions = (data as UserSubmissionsResponse).submissions;
      setSubmissions(newSubmissions);
    }
  }, [data]);

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

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4.6rem)] bg-slate-950 flex flex-col items-center justify-center">
          <LoadingSpinner size={50} />
          <p className="text-slate-400">Loading your submissions...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="bg-red-500/10 border-red-500/20 max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">
              Error Loading Submissions
            </h3>
            <p className="text-red-300/80 mb-4">
              Failed to load your submission history.
            </p>
            <Button
              onClick={refetch}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getVerdictStyling = (verdict: string) => {
    switch (verdict) {
      case "Accepted":
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-400" />,
          badgeClass: "bg-green-500/10 text-green-400 border-green-500/20",
        }
      case "Wrong Answer":
        return {
          icon: <XCircle className="h-4 w-4 text-red-400" />,
          badgeClass: "bg-red-500/10 text-red-400 border-red-500/20",
        }
      case "Time Limit Exceeded":
        return {
          icon: <Clock className="h-4 w-4 text-yellow-400" />,
          badgeClass: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        }
      case "Runtime Error":
        return {
          icon: <AlertTriangle className="h-4 w-4 text-orange-400" />,
          badgeClass: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        }
      default:
        return {
          icon: <Code className="h-4 w-4 text-slate-400" />,
          badgeClass: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        }
    }
  }

  const getLanguageColor = (language: string) => {
    switch (language.toLowerCase()) {
      case "python":
        return "text-green-400"
      case "c++":
      case "cpp":
        return "text-blue-400"
      case "java":
        return "text-orange-400"
      case "javascript":
        return "text-yellow-400"
      default:
        return "text-slate-400"
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="bg-slate-900/50 border-slate-800 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{firstLetter}</span>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <div>
                  <h1 className="text-2xl font-bold text-white">{user && user.username}</h1>
                  <div className="flex items-center justify-center md:justify-start space-x-2 mt-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-400">{user && user.email}</span>
                  </div>
                </div>

                <div className="text-slate-300">
                  <p>Welcome to your coding profile! Track your progress and submissions here.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest Submissions */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Code className="h-5 w-5 text-blue-400" />
              <span>Latest Submissions</span>
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 ml-2">{submissions.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length > 0 ? (
              <div className="space-y-3">
                {submissions.map((submission) => {
                  const styling = getVerdictStyling(submission.verdict)
                  const { date, time } = formatTimestamp(submission.timestamp)
                  return (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {styling.icon}
                        <div>
                          <div className="text-white font-medium">{submission.problem_name}</div>
                          <div className="text-sm text-slate-400">
                            <span className={getLanguageColor(submission.language)}>{submission.language}</span>
                            <span className="mx-2">•</span>
                            <span>{date} {" • "}{time}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={styling.badgeClass}>{submission.verdict}</Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Code className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">No submissions yet</p>
                <p className="text-slate-500 text-sm">Start solving problems to see your submissions here!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage
