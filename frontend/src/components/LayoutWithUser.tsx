"use client";

import { useGetUserQuery } from "@/redux/auth/authApi";
import { Skeleton } from "./ui/skeleton";
import Navbar from "./Navbar";
import { setUser } from "@/redux/auth/authSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const LayoutWithUser = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const access =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;
  const [isLoading, setLoading] = useState(!!access);
  const { data: user } = useGetUserQuery(undefined, {
    skip: !access,
  });


  console.log(user);

  useEffect(() => {
    // Save user to slice if fetched
    if (user) {
      dispatch(setUser(user));
      setLoading(false);
    }
  }, [user, dispatch]);

  if (isLoading) {
    return (
      <div className="flex flex-col p-2">
        <Skeleton className="h-12 rounded-lg" />
        <div className="hidden lg:flex items-center justify-around flex-wrap gap-5 mt-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="flex flex-col space-y-3" key={index}>
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-around flex-wrap gap-5 mt-2">
          <div className="flex lg:hidden flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
        </div>
        <div className="flex lg:hidden flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
        </div>
        </div>
        <div className="flex items-center flex-col gap-3 mt-7">
          <Skeleton className="w-[90%] rounded-full h-6" />
          <Skeleton className="w-[65%] rounded-full h-6" />
          <Skeleton className="w-[75%] rounded-full h-6" />
          <Skeleton className="w-[85%] rounded-full h-6" />
        </div>
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
