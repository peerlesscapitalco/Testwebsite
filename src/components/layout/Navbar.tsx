"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface NavUser {
  firstName: string;
  lastName: string;
  role: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<NavUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "charity_admin") return "/charity/dashboard";
    return "/donor/dashboard";
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Hope<span className="text-primary-600">Fund</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/donor/causes" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Browse Causes
            </Link>
            <Link href="/donor/tracking" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Track Impact
            </Link>
            <Link href="/register?role=charity_admin" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              For Charities
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href={getDashboardLink()}>
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
            <Link href="/donor/causes" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              Browse Causes
            </Link>
            <Link href="/donor/tracking" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              Track Impact
            </Link>
            <Link href="/register?role=charity_admin" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              For Charities
            </Link>
            {user ? (
              <>
                <Link href={getDashboardLink()} className="block px-3 py-2 text-sm text-primary-600 font-medium hover:bg-gray-50 rounded-lg">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  Sign In
                </Link>
                <Link href="/register" className="block px-3 py-2 text-sm text-primary-600 font-medium hover:bg-gray-50 rounded-lg">
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
