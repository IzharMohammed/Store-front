"use client";

import { useEffect, useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/utils/format";
import { getPasswordStrength } from "@/utils/password-strength";
import { signup, redirectToLogin } from "@/actions/signup";

interface SignupFormProps {
  onSuccess?: () => void;
}

const initialState = {
  success: false,
  error: null,
  user: undefined,
};

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  const [formData, setFormData] = useState({
    name: "",
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
       redirectToLogin()
      }, 2000);
    }
  }, [state.success, onSuccess]);

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <motion.form action={formAction} className="space-y-6">
      {/* Name Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <Label
          htmlFor="name"
          className="text-sm font-medium flex items-center gap-2"
        >
          <User className="h-4 w-4 text-primary" />
          Full Name
        </Label>
        <div className="relative">
          <Input
            id="name"
            name="name" // Important: add name attribute for form submission
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isPending}
            className="h-12 pl-4 pr-10 bg-muted/30 border-0 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300"
          />
          <motion.div
            animate={{
              scale: formData.name ? 1 : 0.8,
              opacity: formData.name ? 1 : 0.5,
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <CheckCircle
              className={cn(
                "h-5 w-5 transition-colors",
                formData.name.length > 2
                  ? "text-green-500"
                  : "text-muted-foreground"
              )}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Email Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
        transition={{ delay: 0.3 }}
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
            placeholder="Create a secure password"
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
                passwordStrength.strength >= 75
                  ? "text-green-500"
                  : "text-muted-foreground"
              )}
            />
          </div>
        </div>

        {/* Password Strength Indicator */}
        <AnimatePresence>
          {formData.password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Password Strength</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    passwordStrength.strength >= 75 &&
                      "border-green-500 text-green-600",
                    passwordStrength.strength >= 50 &&
                      passwordStrength.strength < 75 &&
                      "border-blue-500 text-blue-600",
                    passwordStrength.strength < 50 &&
                      "border-red-500 text-red-600"
                  )}
                >
                  {passwordStrength.label}
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${passwordStrength.strength}%`,
                  }}
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    passwordStrength.color
                  )}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
                Creating Account...
              </>
            ) : (
              <>
                <User className="mr-3 h-5 w-5" />
                Create Account
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
              Account created successfully! Redirecting to dashboard...
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

      {/* Login Link */}
      <div className="text-center pt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted-foreground/20"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Already have an account?
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          className="text-primary hover:text-primary/80 font-medium transition-colors mt-4"
          onClick={() => redirectToLogin()}
          disabled={isPending}
        >
          Sign in instead →
        </motion.button>
      </div>
    </motion.form>
  );
}
