"use client";

import React, { useRef, useState } from "react";
import { User, Lock } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [signUp, setSignUp] = useState({
    username: "",
    password: "",
  });

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

  function handleForm(e) {
    const { name, value } = e.target;

    // assigning the new calues
    setSignUp((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // api call
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signUp),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data.error);
      return;
    }

    console.log("Signup success:", data);
    router.push("/room");
  }

  return (
    <form
      className="min-h-screen bg-black flex items-center justify-center px-4"
      onSubmit={handleSubmit}
    >
      <div
        ref={cardRef}
        className="w-full max-w-md bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl"
      >
        <h1 className="text-3xl font-black text-white mb-2">
          Create an account
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Choose a username and password
        </p>

        {/* Username */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-1 block">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              name="username"
              value={signUp.username}
              onChange={handleForm}
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
              name="password"
              value={signUp.password}
              onChange={handleForm}
              placeholder="••••••••"
              className="pl-10 bg-gray-900 border-gray-800 text-white"
            />
          </div>
        </div>

        <Button type="submit" className="w-full font-semibold">
          Sign up
        </Button>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <span
            className="text-white hover:underline cursor-pointer"
            onClick={() => router.push("/")}
          >
            Log in
          </span>
        </p>
      </div>
    </form>
  );
}
