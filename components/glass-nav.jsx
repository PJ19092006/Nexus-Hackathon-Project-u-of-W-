"use client";

import { Home, UserPlus, Phone, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: <Home size={18} />, label: "Home" },
  { href: "/dashboard", icon: <UserPlus size={18} />, label: "Dashboard" },
  { href: "/#contact-us", icon: <Phone size={18} />, label: "Contact Us" },
  { href: "/login", icon: <LogIn size={18} />, label: "Log in" },
];

export default function GlassNav() {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        "fixed z-50 left-1/2 -translate-x-1/2",
        "bottom-4 md:top-4 md:bottom-auto", // Show on bottom in mobile, top on md+
        "w-fit rounded-full px-4 py-2",
        "backdrop-blur-md bg-white/10 border border-white/20 shadow-md",
        "flex gap-1 sm:gap-2 items-center"
      )}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full transition-all",
              "text-white hover:bg-white/10",
              isActive && "bg-white/20"
            )}
          >
            {item.icon}
            <span className="hidden sm:inline text-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
