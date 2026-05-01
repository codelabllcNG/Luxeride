"use client"; // Essential for Framer Motion in Next.js App Router

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

// Combining the props with Framer Motion types
type CombinedProps = ButtonProps & HTMLMotionProps<"button">;

export const Button: React.FC<CombinedProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  className = "",
  children,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg relative overflow-hidden";


  const variants = {
    primary: "bg-primary text-grey-pastel hover:bg-primary/90 focus:ring-primary",
    secondary: "bg-secondary text-grey-pastel hover:bg-secondary/90 focus:ring-secondary",
    outline: "border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary",
    ghost: "text-primary hover:bg-primary/10 focus:ring-primary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      <span className={`flex items-center justify-center gap-2 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        {children}
      </span>
    </motion.button>
  );

};