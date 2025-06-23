// src/redux/auth/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    register: builder.mutation<any, any>({
      query: (body) => ({
        url: "register/",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<any, any>({
      query: (body) => ({
        url: "login/",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<any, { refresh: string }>({
      query: (body) => ({
        url: "logout/",
        method: "POST",
        body,
      }),
    }),
    getUser: builder.query<any, void>({
      query: () => "user/",
    }),
    refreshToken: builder.mutation<{ access: string }, { refresh: string }>({
      query: (body) => ({
        url: "token/refresh/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetUserQuery,
  useRefreshTokenMutation,
} = authApi;
