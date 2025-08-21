// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { BorderBeam } from "@/components/magicui/border-beam";
// import { useEffect, useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { sessionManager } from "@/lib/session-manager";

// interface FormData {
//   email: string;
//   password: string;
// }

// interface LoginResponse {
//   message: string;
//   token: string;
//   user: {
//     id: string;
//     email: string;
//     name: string;
//   };
// }

// async function signin(formData: FormData) {
//   const response = await fetch("/api/signin", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(formData),
//   });
//   console.log("response", response);

//   if (!response.ok) {
//     throw new Error("Signup failed");
//   }

//   const data: LoginResponse = await response.json();

//   // Handle successful login
//   sessionManager.setAuthenticatedUser(data);

//   // // Redirect to dashboard or intended page
//   // const redirectUrl = (router.query.redirect as string) || "/dashboard";
//   // router.push(redirectUrl);

//   return data;
// }

// export default function LoginPage() {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   useEffect(() => {
//     // Initialize session management when component mounts
//     // sessionManager.init();

//     // Check if user is already authenticated
//     if (sessionManager.isAuthenticated()) {
//       router.push("/"); // Redirect to dashboard or home page
//     }
//   }, [router]);

//   const mutation = useMutation({
//     mutationFn: signin,
//     onSuccess: (data) => {
//       console.log("Signin successful:", data);
//       router.push("/");
//     },
//     onError: (error) => {
//       console.error("Signin error:", error);
//     },
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;

//     console.log([id, value]);

//     setFormData((prev) => ({
//       ...prev,
//       [id]: value,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form", formData);
//     mutation.mutate(formData);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <Card className="relative w-[350px] overflow-hidden">
//         <CardHeader>
//           <CardTitle>Login</CardTitle>
//           <CardDescription>
//             Enter your credentials to access your account.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <div className="grid w-full items-center gap-4">
//               <div className="flex flex-col space-y-1.5">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="flex flex-col space-y-1.5">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>
//             <CardFooter className="flex justify-end p-0 pt-4">
//               <Button type="submit">Login</Button>
//             </CardFooter>
//           </form>
//         </CardContent>
//         <BorderBeam
//           duration={4}
//           size={300}
//           reverse
//           className="from-transparent via-green-500 to-transparent"
//         />
//       </Card>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { sessionManager } from "@/lib/session-manager";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  Users,
  Zap,
  Heart,
  Star,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    throw new Error("Signin failed");
  }

  const data: LoginResponse = await response.json();

  // Handle successful login
  sessionManager.setAuthenticatedUser(data);

  return data;
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const floatingVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [-5, 5, -5],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const sparkleVariants: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    if (sessionManager.isAuthenticated()) {
      router.push("/"); // Redirect to dashboard or home page
    }
  }, [router]);

  const mutation = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      console.log("Signin successful:", data);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        router.push("/");
      }, 2000);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Shapes */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
          className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "4s" }}
          className="absolute bottom-32 left-40 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
        />

        {/* Sparkle Elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={sparkleVariants}
            animate="animate"
            style={{
              animationDelay: `${i * 0.5}s`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            className="absolute"
          >
            <Sparkles className="h-4 w-4 text-primary/40" />
          </motion.div>
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-8"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary via-purple-600 to-pink-600 text-white shadow-lg mx-auto"
            >
              <LogIn className="h-8 w-8" />
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-gray-100 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-lg text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center gap-6 pt-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-blue-500" />
                <span>Trusted</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Fast Access</span>
              </div>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-background/95 via-background to-background/95 backdrop-blur-xl">
              {/* Custom Border Animation */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-pulse"></div>
              <div className="absolute inset-[1px] rounded-lg bg-background"></div>
              <div className="relative z-10">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                    <LogIn className="h-5 w-5 text-primary" />
                    Sign In
                  </CardTitle>
                  <CardDescription className="text-base">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <motion.form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4 text-primary" />
                        Email Address
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="h-12 pl-4 pr-10 bg-muted/30 border-0 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300"
                        />
                        <motion.div
                          animate={{
                            scale: formData.email ? 1 : 0.8,
                            opacity: formData.email ? 1 : 0.5,
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <CheckCircle
                            className={cn(
                              "h-5 w-5 transition-colors",
                              formData.email.includes("@") &&
                                formData.email.includes(".")
                                ? "text-green-500"
                                : "text-muted-foreground"
                            )}
                          />
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Password Field */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4 text-primary" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="h-12 pl-4 pr-20 bg-muted/30 border-0 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowPassword(!showPassword)}
                            className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </motion.button>
                          <CheckCircle
                            className={cn(
                              "h-5 w-5 transition-colors",
                              formData.password.length >= 6
                                ? "text-green-500"
                                : "text-muted-foreground"
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={itemVariants} className="pt-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          disabled={mutation.isPending}
                          className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-70"
                        >
                          {mutation.isPending ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="mr-3"
                              >
                                <Loader2 className="h-5 w-5" />
                              </motion.div>
                              Signing In...
                            </>
                          ) : (
                            <>
                              <LogIn className="mr-3 h-5 w-5" />
                              Sign In
                              <motion.div
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="ml-3"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </motion.div>
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.form>

                  {/* Success Message */}
                  <AnimatePresence>
                    {isSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
                      >
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          Login successful! Redirecting... 🎉
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error Message */}
                  <AnimatePresence>
                    {mutation.isError && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                      >
                        <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                          <span className="text-white text-xs">!</span>
                        </div>
                        <span className="text-sm font-medium text-red-600">
                          {mutation.error?.message ||
                            "Login failed. Please check your credentials and try again."}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>

                <CardFooter className="text-center pt-6 pb-8">
                  <div className="w-full space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-muted-foreground/20"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Don't have an account?
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Create an account →
                    </motion.button>

                    {/* Forgot Password Link */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="block w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Forgot your password?
                    </motion.button>
                  </div>
                </CardFooter>
              </div>
            </Card>
          </motion.div>

          {/* Bottom Features */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              <div className="space-y-2">
                <div className="h-8 w-8 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Bank-level Security
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-8 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <p className="text-xs text-muted-foreground">Quick Access</p>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-8 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <p className="text-xs text-muted-foreground">24/7 Support</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(
            circle,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px
          );
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
