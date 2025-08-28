"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderExpandToggleProps {
  orderId: string;
}

export function OrderExpandToggle({ orderId }: OrderExpandToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleExpansion}
      className="p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label={
        isExpanded ? "Collapse order details" : "Expand order details"
      }
    >
      <ChevronDown
        className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
          isExpanded ? "rotate-180" : ""
        }`}
      />
    </Button>
  );
}
