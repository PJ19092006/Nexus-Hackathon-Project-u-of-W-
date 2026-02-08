"use client";

import React, { useRef } from "react";
import { User, Lock, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const cardRef = useRef(null);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
    });
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div
        ref={cardRef}
        className="w-full max-w-md bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl"
      >
        <h1 className="text-3xl font-black text-white mb-2">
          Login to your account
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Enter your credentials to continue
        </p>

        {/* Username */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-1 block">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="your_username"
              className="pl-10 bg-gray-900 border-gray-800 text-white"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm text-gray-300 mb-1 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-10 bg-gray-900 border-gray-800 text-white"
            />
          </div>
        </div>

        {/* Login */}
        <Button className="w-full mb-3 font-semibold">Login</Button>

        {/* Guest */}
        <Button
          variant="outline"
          className="w-full border-gray-700 text-gray-950 hover:bg-gray-900 hover:text-white"
          onClick={() => router.push("/room")}
        >
          Continue as Guest
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>

        {/* Footer */}
        <p className="text-sm text-gray-400 mt-6 text-center">
          Don&apos;t have an account?{" "}
          <span
            className="text-white hover:underline cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
