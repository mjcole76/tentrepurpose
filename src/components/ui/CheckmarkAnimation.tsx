"use client";

import { motion } from "framer-motion";

interface CheckmarkAnimationProps {
  size?: number;
  className?: string;
}

export default function CheckmarkAnimation({
  size = 48,
  className,
}: CheckmarkAnimationProps) {
  return (
    <div className={className}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 0.4, ease: "easeOut" },
            },
          }}
        />
        <motion.path
          d="M14 24 L21 31 L34 18"
          fill="none"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 0.3, delay: 0.3, ease: "easeOut" },
            },
          }}
        />
      </motion.svg>
    </div>
  );
}
