"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/magicui/border-beam";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { sessionManager } from "@/lib/session-manager";

interface FormData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

async function signin(formData: FormData) {
  const response = await fetch("/api/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  console.log("response", response);

  if (!response.ok) {
    throw new Error("Signup failed");
  }

  const data: LoginResponse = await response.json();

  // Handle successful login
  sessionManager.setAuthenticatedUser(data);

  // // Redirect to dashboard or intended page
  // const redirectUrl = (router.query.redirect as string) || "/dashboard";
  // router.push(redirectUrl);

  return data;
}

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Initialize session management when component mounts
    sessionManager.init();

    // Check if user is already authenticated
    if (sessionManager.isAuthenticated()) {
      router.push("/"); // Redirect to dashboard or home page
    }
  }, [router]);

  const mutation = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      console.log("Signin successful:", data);
      router.push("/");
    },
    onError: (error) => {
      console.error("Signin error:", error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    console.log([id, value]);

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form", formData);
    mutation.mutate(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="relative w-[350px] overflow-hidden">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <CardFooter className="flex justify-end p-0 pt-4">
              <Button type="submit">Login</Button>
            </CardFooter>
          </form>
        </CardContent>
        <BorderBeam
          duration={4}
          size={300}
          reverse
          className="from-transparent via-green-500 to-transparent"
        />
      </Card>
    </div>
  );
}
