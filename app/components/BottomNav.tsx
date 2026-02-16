"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, UserCircle } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function BottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Hide on public pages, onboarding, and chat pages
  const hiddenRoutes = ["/", "/login", "/onboarding"];
  if (!user) return null;
  if (hiddenRoutes.includes(pathname)) return null;
  if (pathname.startsWith("/matches/") && pathname !== "/matches") return null;

  const tabs = [
    { href: "/browse", label: "Browse", icon: Search },
    { href: "/matches", label: "Matches", icon: Heart },
    { href: "/profile", label: "Profile", icon: UserCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 sm:hidden">
      <div className="flex items-center justify-around h-16 pb-safe">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "text-uw-purple"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
