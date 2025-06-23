// src/redux/auth/customBaseQuery.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://127.0.0.1:8000/api/v1/",
  prepareHeaders: (headers) => {
    if (typeof window !== "undefined") {
      const access = localStorage.getItem("access");
      if (access) {
        headers.set("Authorization", `Bearer ${access}`);
      }
    }
    return headers;
  },
});

export const customBaseQuery = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refresh =
      typeof window !== "undefined" ? localStorage.getItem("refresh") : null;
    if (refresh) {
      const refreshResult = await baseQuery(
        {
          url: "token/refresh/",
          method: "POST",
          body: { refresh },
        },
        api,
        extraOptions
      );
      if (refreshResult.data && (refreshResult.data as any).access) {
        localStorage.setItem("access", (refreshResult.data as any).access);
        if ((refreshResult.data as any).refresh) {
          localStorage.setItem("refresh", (refreshResult.data as any).refresh);
        }
        
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, log out
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
    } else {
      // No refresh token, log out
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
  }

  return result;
};
