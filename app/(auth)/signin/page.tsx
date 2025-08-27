import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn, Sparkles } from "lucide-react";
import { SigninForm } from "@/components/signin-form";
import { cookieManager } from "@/utils/authTools";
import { redirect } from "next/navigation";

// Animation variants
// const containerVariants: Variants = {
//   hidden: { opacity: 0, scale: 0.95 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     transition: {
//       duration: 0.5,
//       staggerChildren: 0.1,
//     },
//   },
// };

// const itemVariants: Variants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       type: "spring",
//       stiffness: 100,
//       damping: 15,
//     },
//   },
// };

// const floatingVariants: Variants = {
//   animate: {
//     y: [-10, 10, -10],
//     rotate: [-5, 5, -5],
//     transition: {
//       duration: 6,
//       repeat: Infinity,
//       ease: "easeInOut",
//     },
//   },
// };

// const sparkleVariants: Variants = {
//   animate: {
//     scale: [1, 1.2, 1],
//     opacity: [0.7, 1, 0.7],
//     transition: {
//       duration: 2,
//       repeat: Infinity,
//       ease: "easeInOut",
//     },
//   },
// };

async function checkAuthentication() {
  const isAuthenticated = await cookieManager.isAuthenticated();
  if (isAuthenticated) {
    redirect("/");
  }
}

export default async function SigninPage() {
  // Check if user is already authenticated
  await checkAuthentication();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-xl" />
        <div
          style={{ animationDelay: "2s" }}
          className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-xl"
        />
        <div
          style={{ animationDelay: "4s" }}
          className="absolute bottom-32 left-40 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
        />

        {/* Sparkle Elements */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              animationDelay: `${i * 0.5}s`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            className="absolute"
          >
            <Sparkles className="h-4 w-4 text-primary/40" />
          </div>
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary via-purple-600 to-pink-600 text-white shadow-lg mx-auto">
              <LogIn className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-gray-100 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-lg text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>
          </div>

          {/* Signin Form Card */}
          <div>
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
                  <SigninForm />
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
