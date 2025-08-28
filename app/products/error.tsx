"use client"; 

import { motion } from "framer-motion";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-red-500 text-lg mb-4">
            Error loading Products.
          </div>
          <Button variant="outline" asChild>
            <Link href="/">
              Go Back
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
