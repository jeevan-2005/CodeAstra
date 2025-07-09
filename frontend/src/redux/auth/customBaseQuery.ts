// src/redux/auth/customBaseQuery.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface RefreshResult {
  access: string;
  refresh: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
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
      if (refreshResult.data && (refreshResult.data as RefreshResult).access) {
        localStorage.setItem("access", (refreshResult.data as RefreshResult).access);
        if ((refreshResult.data as RefreshResult).refresh) {
          localStorage.setItem("refresh", (refreshResult.data as RefreshResult).refresh);
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
