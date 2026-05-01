import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

/**
 * Card Component
 * Works in Next.js App Router as a Server Component.
 * Ensure 'dark', 'dark-lighter', and 'primary' are defined in your tailwind.config.js.
 */
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

  // We use a clean template literal for better readability
  const cardClasses = [
    "bg-dark rounded-2xl border border-dark-lighter",
    "transition-all duration-300",
    hoverable ? "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5" : "",
    paddingStyles[padding],
    className,
  ].join(" ");

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}