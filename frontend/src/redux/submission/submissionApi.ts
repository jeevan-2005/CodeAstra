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
  code: string;
  user_input: string;
  language: string;
}

export interface RunCustomTestCaseResponse {
  output: string;
}

export interface SubmitCodeRequest {
  user_id: number | undefined;
  problem_id: number;
  code: string;
  language: string;
}

export interface SubmitCodeResponse {
  verdict: string;
  details: string;
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
    runCustomTestCase: builder.mutation<RunCustomTestCaseResponse, RunCustomTestCaseRequest>({
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
    })
  }),
});

export const { useSaveCodeMutation, useGetSavedCodeQuery, useRunCustomTestCaseMutation, useSubmitCodeMutation } = submissionApi;
export default submissionApi;
