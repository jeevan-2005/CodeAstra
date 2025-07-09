"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";
import { RootState } from "@/redux/store";
import { useGetUserQuery } from "@/redux/auth/authApi";
import { useRouter } from "next/navigation";

const ProtectedComponent = ({ children }: { children: React.ReactNode }) => {
  const [hasToken, setHasToken] = React.useState(false);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const { isLoading } = useGetUserQuery(undefined, {
    skip: !hasToken || !!user,
  });

  useEffect(() => {
    const token = localStorage.getItem("refresh");
    setHasToken(!!token);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !hasToken) {
    return (
      <div className="h-[calc(100vh-4.2rem)] flex flex-col items-center justify-center bg-slate-950">
        <LoadingSpinner size={50} />
        <p className="text-slate-400">Checking authentication...</p>
      </div>
    );
  }

  if (user) {
    return children;
  }

  return (
    <div className="h-[calc(100vh-4.2rem)] flex flex-col items-center justify-center bg-slate-950">
      <LoadingSpinner size={50} />
      <p className="text-slate-400">Redirecting to login...</p>
    </div>
  );
};

export default ProtectedComponent;
