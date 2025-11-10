"use client";

import React from "react";
import { cn } from "@/lib/utils"; // optional: if you use a className merge utility

interface LabelProps {
  text: string;
  variant?: "default" | "info" | "success" | "warning" | "error";
  className?: string;
}

const variantStyles: Record<NonNullable<LabelProps["variant"]>, string> = {
  default: "text-gray-300",
  info: "text-blue-400",
  success: "text-green-400",
  warning: "text-yellow-400",
  error: "text-red-400",
};

export const Label: React.FC<LabelProps> = ({
  text,
  variant = "default",
  className = "",
}) => {
  return (
    <div
      className={cn(
        "w-full text-center mt-20 text-3xl font-medium select-none",
        variantStyles[variant],
        className
      )}
      role="status"
      aria-live="polite"
    >
      {text}
    </div>
  );
};
