"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Ticket, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Ticket className="h-6 w-6 text-accent" />
          <span className="text-xl font-bold tracking-tight">BookMyTicket</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/book"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Book Seats
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {!mounted || isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-secondary" />
          ) : isAuthenticated ? (
            <>
              <div className="hidden items-center gap-2 sm:flex">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
