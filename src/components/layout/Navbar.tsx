"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Library,
  Calendar,
  User,
  Plus,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { href: "/library", label: "Library", icon: Library },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/account", label: "Account", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl",
        isLanding ? "bg-background/80" : "bg-surface/80"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold font-[family-name:var(--font-heading)] text-foreground">
              Repurpose
            </span>
          </Link>

          {!isLanding && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary bg-primary/5"
                        : "text-secondary hover:text-foreground hover:bg-surface-hover"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isLanding ? (
              <>
                <Link href="/create">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/create">
                  <Button size="sm">Get Started Free</Button>
                </Link>
              </>
            ) : (
              <Link href="/create">
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                  New Content
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
