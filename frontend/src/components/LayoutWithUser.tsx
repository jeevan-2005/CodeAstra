"use client";

import { useGetUserQuery } from "@/redux/auth/authApi";
import Navbar from "./Navbar";
import { setUser } from "@/redux/auth/authSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";

const LayoutWithUser = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [access, setAccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("access", localStorage.getItem("access"));
      setAccess(localStorage.getItem("access"));
    }
  }, []);

  const { data: user, isLoading } = useGetUserQuery(undefined, {
    skip: !access,
  });

  useEffect(() => {
    // Save user to slice if fetched
    if (user) {
      dispatch(setUser(user));
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
