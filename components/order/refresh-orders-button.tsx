"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function RefreshOrdersButton() {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <Button
      variant="outline"
      onClick={handleRefresh}
      className="border-border hover:bg-muted transition-colors"
    >
      <RefreshCw className="w-4 h-4 mr-2" />
      Refresh Orders
    </Button>
  );
}
