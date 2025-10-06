"use client";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { DumbbellIcon, UserIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

const NavBar = () => {
  const { isSignedIn } = useUser();
  const [mounted, setMounted] = useState(false);

  // Ensure rendering only happens on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder to avoid hydration mismatch
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1 bg-[#BF00FF]/10 rounded">
              <ZapIcon className="w-4 h-4 text-[#BF00FF]" />
            </div>
            <span className="text-xl font-bold font-mono">
              Fit<span className="text-[#BF00FF]">Bot</span>.ai
            </span>
          </Link>
          <nav className="flex items-center gap-5">
            {/* empty space to prevent layout shift */}
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1 bg-[#BF00FF]/10 rounded">
            <ZapIcon className="w-4 h-4 text-[#BF00FF]" />
          </div>
          <span className="text-xl font-bold font-mono">
            Fit<span className="text-[#BF00FF]">Bot</span>.ai
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-5">
          {isSignedIn ? (
            <>
              <Link
                href="/generate-program"
                className="flex items-center gap-1.5 text-sm text-[#BF00FF] hover:text-[#BF00FF]/80 transition-colors"
              >
                <DumbbellIcon size={16} />
                <span>Generate</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-1.5 text-sm text-[#BF00FF] hover:text-[#BF00FF]/80 transition-colors"
              >
                <UserIcon size={16} />
                <span>Profile</span>
              </Link>
              <Button
                asChild
                variant="outline"
                className="ml-2 border-[#BF00FF]/50 text-[#BF00FF] hover:text-white hover:bg-[#BF00FF]/10"
              >
                <Link href="/generate-program">Get Started</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton>
                <Button
                  variant="outline"
                  className="border-[#BF00FF]/50 text-[#BF00FF] hover:text-white hover:bg-[#BF00FF]/10"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="bg-[#BF00FF] text-white hover:bg-[#BF00FF]/90">
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
