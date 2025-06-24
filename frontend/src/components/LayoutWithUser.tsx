"use client";

import { useGetUserQuery } from "@/redux/auth/authApi";
import { Skeleton } from "./ui/skeleton";
import Navbar from "./Navbar";
import { setUser } from "@/redux/auth/authSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";

const LayoutWithUser = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [access, setAccess] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccess(localStorage.getItem("access"));
    }
  }, []);

  const { data: user } = useGetUserQuery(undefined, {
    skip: !access,
  });

  useEffect(() => {
    // Save user to slice if fetched
    if (user) {
      dispatch(setUser(user));
      setLoading(false);
    }
  }, [user, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <LoadingSpinner size={55} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default LayoutWithUser;
