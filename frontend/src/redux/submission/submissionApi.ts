import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../auth/customBaseQuery";

interface GetSavedCodeParams {
  user_id?: number;
  problem_id?: number;
  language?: string;
}

interface SavedCodeResponse {
  code: string;
}

interface SavedCodeRequest {
  code: string;
  user_id: number | undefined;
  problem_id: number;
  language: string;
}

interface RunCustomTestCaseRequest {
  code?: string;
  user_input: string;
  language: string;
}

export interface RunCustomTestCaseResponse {
  output: string;
}

export interface SubmitCodeRequest {
  user_id: number | undefined;
  problem_id: number;
  code: string | undefined;
  language: string;
}

export interface SubmitCodeResponse {
  verdict: string;
  details: string;
}

export interface getAIReviewRequest {
  code?: string;
  reviewType: string;
  problem_name: string;
  problem_statement: string;
  problem_constraints: string;
  language?: string;
}

export interface getAiReviewResponse {
  review: string;
}

export interface Submission {
  id: number;
  problem_name: string;
  code: string;
  language: string;
  verdict: string;
  problem_id: number;
  timestamp: string;
  time_taken: number;
  memory_taken: number;
}

export interface UserSubmissionsResponse {
  submissions: Submission[];
}

const submissionApi = createApi({
  reducerPath: "submissionApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    saveCode: builder.mutation<void, SavedCodeRequest>({
      query: (body) => ({
        url: "save-code/",
        method: "POST",
        body,
      }),
    }),
    getSavedCode: builder.query<SavedCodeResponse, GetSavedCodeParams>({
      query: (params) => {
        let url = "save-code/";
        const queryParams = new URLSearchParams();

        if (params.user_id) {
          queryParams.append("user_id", String(params.user_id));
        }
        if (params.problem_id) {
          queryParams.append("problem_id", String(params.problem_id));
        }
        if (params.language) {
          queryParams.append("language", params.language);
        }
        const queryString = queryParams.toString();
        if (queryString) {
          url = `${url}?${queryString}`;
        }
        return url;
      },
    }),
    runCustomTestCase: builder.mutation<
      RunCustomTestCaseResponse,
      RunCustomTestCaseRequest
    >({
      query: (body) => ({
        url: "execute/run/",
        method: "POST",
        body,
      }),
    }),
    submitCode: builder.mutation<SubmitCodeResponse, SubmitCodeRequest>({
      query: (body) => ({
        url: "execute/submit/",
        method: "POST",
        body,
      }),
    }),
    getAiReview: builder.mutation<getAiReviewResponse, getAIReviewRequest>({
      query: (body) => ({
        url: "ai-review/",
        method: "POST",
        body,
      }),
    }),
    getUserSubmissions: builder.query<UserSubmissionsResponse, number | undefined>({
      query: (user_id: number) => ({
        url: `/submissions/${user_id}`,
        method: "GET",
      }),
    }),
    getUserSubmissionByProblemId: builder.query<
      UserSubmissionsResponse,
      { user_id: number | undefined; problem_slug: string }
    >({
      query: ({ user_id, problem_slug }) => ({
        url: `/submissions/${user_id}/${problem_slug}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSaveCodeMutation,
  useGetSavedCodeQuery,
  useRunCustomTestCaseMutation,
  useSubmitCodeMutation,
  useGetAiReviewMutation,
  useGetUserSubmissionsQuery,
  useGetUserSubmissionByProblemIdQuery,
} = submissionApi;

export default submissionApi;
