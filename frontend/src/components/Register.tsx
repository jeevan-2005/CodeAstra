"use client";

import { useState } from "react";
import { Eye, EyeOff, User, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/redux/auth/authApi";
import { setUser } from "@/redux/auth/authSlice";
import { useDispatch } from "react-redux";

const Register = () => {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const initialFormData = {
    username: "",
    email: "",
    password1: "",
    password2: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLocalError(null);

    try {
      const data = await register(formData).unwrap();
      setFormData(initialFormData);
      if (data.tokens) {
        localStorage.setItem("access", data.tokens.access);
        localStorage.setItem("refresh", data.tokens.refresh);
      }
      if (data.id && data.username && data.email) {
        dispatch(
          setUser({ id: data.id, username: data.username, email: data.email })
        );
      }
      router.push("/");
    } catch (err: any) {
      if (err && typeof err === "object" && err.data) {
        setLocalError(
          Object.values(err.data)
            .map((val) => (Array.isArray(val) ? val.join(", ") : String(val)))
            .join(" ")
        );
      } else {
        setLocalError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>
          Enter your details to create your CodeAstra account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password1"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password1}
                onChange={handleInputChange}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="password2"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.password2}
                onChange={handleInputChange}
                required
              />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showConfirmPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>

          {localError && (
            <div className="text-red-500 text-center">{localError}</div>
          )}

          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full mt-3 cursor-pointer"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Register;
