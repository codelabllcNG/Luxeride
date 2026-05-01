import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Card({
  hoverable = false,
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`
        bg-dark rounded-2xl border border-dark-lighter
        transition-all duration-300
        ${
          hoverable
            ? "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            : ""
        }
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
