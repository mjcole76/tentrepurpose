"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  highlight?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      hover = false,
      highlight = false,
      padding = "md",
      children,
      ...props
    },
    ref
  ) => {
    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface rounded-2xl border border-border",
          paddings[padding],
          hover &&
            "hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer hover:-translate-y-0.5",
          highlight && "ring-2 ring-accent border-accent-dark",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
export default Card;
