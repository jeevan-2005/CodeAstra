// src/redux/auth/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { logout, setUser } from "./authSlice";

type registerResponse = {
  tokens: {
    access: string;
    refresh: string;
  };
  id: number;
  username: string;
  email: string;
};

type registerRequest = {
  username: string;
  email: string;
  password1: string;
  password2: string;
};

type loginRequest = {
  email: string;
  password: string;
};

type getUserResponse = {
  id: number;
  username: string;
  email: string;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    register: builder.mutation<registerResponse, registerRequest>({
      query: (body) => ({
        url: "register/",
        method: "POST",
        body,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          if (data.tokens) {
            localStorage.setItem("access", data.tokens.access);
            localStorage.setItem("refresh", data.tokens.refresh);
          }
          if (data.id && data.username && data.email) {
            dispatch(
              setUser({
                id: data.id,
                username: data.username,
                email: data.email,
              })
            );
          }
        } catch (error) {
          console.log("Registration failed: ", error);
        }
      },
    }),
    login: builder.mutation<registerResponse, loginRequest>({
      query: (body) => ({
        url: "login/",
        method: "POST",
        body,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.tokens) {
            localStorage.setItem("access", data.tokens.access);
            localStorage.setItem("refresh", data.tokens.refresh);
          }
          if (data.id && data.username && data.email) {
            dispatch(
              setUser({
                id: data.id,
                username: data.username,
                email: data.email,
              })
            );
          }
        } catch (error) {
          console.log("Login failed: ", error);
        }
      },
    }),
    logout: builder.mutation<void, { refresh: string }>({
      query: (body) => ({
        url: "logout/",
        method: "POST",
        body,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          dispatch(logout());
        } catch (error) {
          console.log("Logout failed: ", error);
        }
      },
    }),
    getUser: builder.query<getUserResponse, void>({
      query: () => "user/",

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.id && data.username && data.email) {
            dispatch(
              setUser({
                id: data.id,
                username: data.username,
                email: data.email,
              })
            );
          }
        } catch (error) {
          console.log("Get user failed: ", error);
        }
      },
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
