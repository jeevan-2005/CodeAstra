/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { isAxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetUserQuery, useLoginMutation } from "@/redux/auth/authApi";
import { setUser } from "@/redux/auth/authSlice";

interface ApiErrorResponse {
  [key: string]: string[];
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const initialFormData = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [localError, setLocalError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLocalError(null);

    try {
      const data = await login(formData).unwrap();
      if (data.tokens) {
        localStorage.setItem("access", data.tokens.access);
        localStorage.setItem("refresh", data.tokens.refresh);
      }
      if (data.id && data.username && data.email) {
        dispatch(
          setUser({ id: data.id, username: data.username, email: data.email })
        );
      }
      
      setFormData(initialFormData);
      router.push("/");
    } catch (err: any) {
      if (err && typeof err === "object" && err.data) {
        setLocalError(
          Object.values(err.data)
            .map((val) => (Array.isArray(val) ? val.join(", ") : String(val)))
            .join(" ")
        );
      } else {
        setLocalError("Login failed. Please try again.");
      }
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email and password to login
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="m@example.com"
            type="email"
            required
            onChange={handleFormChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              onChange={handleFormChange}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
        </div>

        {localError && <p className="text-red-500 text-center">{localError}</p>}

        <Button
          type="submit"
          disabled={isLoading}
          onClick={handleFormSubmit}
          className="cursor-pointer"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Login;
