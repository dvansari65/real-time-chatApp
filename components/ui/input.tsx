import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const inputVariants = cva(
  "w-full rounded-xl border border-neutral-300 bg-white px-4 py-2 text-base text-black shadow-sm placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition",
  {
    variants: {
      intent: {
        default: "",
        error: "border-red-500 text-red-600 placeholder-red-400 focus:ring-red-500",
        success: "border-green-500 text-green-700 placeholder-green-400 focus:ring-green-500",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    VariantProps<typeof inputVariants> {
  as?: "input" | "textarea";
}

const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(({ className, intent, as = "input", ...props }, ref) => {
  const Comp = as;
  return (
    <Comp
      ref={ref as any}
      className={cn(inputVariants({ intent }), className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
