"use client";

import { useEffect, useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";
import { cn } from "@/utils/format";
import {
  signin,
  redireactToLandingPage,
  redirectToSignup,
} from "@/actions/signin";

interface SigninFormProps {
  onSuccess?: () => void;
}

const initialState = {
  success: false,
  error: null,
  user: undefined,
};

export function SigninForm({ onSuccess }: SigninFormProps) {
  const [state, formAction, isPending] = useActionState(signin, initialState);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle success case when state changes
  useEffect(() => {
    if (state.success) {
      onSuccess?.();
      // Auto redirect after 2 seconds
      setTimeout(() => {
        redireactToLandingPage();
      }, 2000);
    }
  }, [state.success, onSuccess]);

  return (
    <motion.form action={formAction} className="space-y-6">
      {/* Email Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
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
            name="email" // Important: add name attribute for form submission
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isPending}
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
                formData.email.includes("@") && formData.email.includes(".")
                  ? "text-green-500"
                  : "text-muted-foreground"
              )}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Password Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
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
            name="password" // Important: add name attribute for form submission
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isPending}
            className="h-12 pl-4 pr-20 bg-muted/30 border-0 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowPassword(!showPassword)}
              disabled={isPending}
              className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-4"
      >
        <motion.div
          whileHover={{ scale: isPending ? 1 : 1.02 }}
          whileTap={{ scale: isPending ? 1 : 0.98 }}
        >
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-70"
          >
            {isPending ? (
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

      {/* Success Message */}
      <AnimatePresence>
        {state.success && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
          >
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              Login successful! Redirecting to dashboard...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {state.error && (
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
              {state.error}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signup Link */}
      <div className="text-center pt-4">
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
          type="button"
          className="text-primary hover:text-primary/80 font-medium transition-colors mt-4"
          onClick={() => redirectToSignup()}
          disabled={isPending}
        >
          Create an account →
        </motion.button>
      </div>
    </motion.form>
  );
}
