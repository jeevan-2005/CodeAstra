import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../auth/customBaseQuery";

interface Tag {
  id: number;
  tag: string;
}

export interface Problem {
  id: number;
  problem_name: string;
  difficulty: string;
  tags: Tag[];
}

export interface GetProblemParams {
  difficulty?: string;
}

export interface GetProblemDetialParam {
  id: number;
}

export interface TestExample {
  id: number;
  input_data: string;
  output_data: string;
  problem: number;
}

export interface SingleProblemDetial {
  id: number;
  problem_name: string;
  problem_statement: string;
  constraints: string;
  code_template: string;
  difficulty: string;
  tags: Tag[];
  input_format: string;
  output_format: string;
  test_examples: TestExample[];
}

const problemApi = createApi({
  reducerPath: "problemApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getProblems: builder.query<Problem[], GetProblemParams>({
      query: (params) => {
        let url = "/problems";
        const queryParams = new URLSearchParams();

        if (params.difficulty) {
          queryParams.append("difficulty", params.difficulty);
        }
        const queryString = queryParams.toString();
        if (queryString) {
          url = `${url}?${queryString}`;
        }

        return url;
      },
    }),
    getProblemDetail: builder.query<SingleProblemDetial, GetProblemDetialParam>({
      query: (params) => {
        return `/problems/${params.id}/`;
      },
    }),
  }),
});

export const { useGetProblemsQuery, useGetProblemDetailQuery } = problemApi;

export default problemApi;
