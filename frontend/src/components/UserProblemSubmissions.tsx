"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  Submission,
  useGetUserSubmissionByProblemIdQuery,
  UserSubmissionsResponse,
} from "@/redux/submission/submissionApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import LoadingSpinner from "./LoadingSpinner";
import SubmissionTable from "./SubmissionTable";

type Props = {
    problemSlug: string
}

const UserProblemSubmissions = ({problemSlug}: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { data, isLoading, isError, refetch } = useGetUserSubmissionByProblemIdQuery(
    {
      user_id: user?.id,
      problem_slug: encodeURIComponent(problemSlug),
    }
  );
  useEffect(() => {
    if (data) {
      const newSubmissions = (data as UserSubmissionsResponse).submissions;
      setSubmissions(newSubmissions);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size={50} />
          <p className="text-slate-400">Loading your submissions...</p>
        </div>
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

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <SubmissionTable submissions={submissions} problemSlug={problemSlug}  />
    </div>
  );
}

export default UserProblemSubmissions