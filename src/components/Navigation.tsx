"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

export default function Navigation() {
  const pathname = usePathname();
  const { authenticated, login, logout } = usePrivy();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/bounties", label: "Bounties" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="glass-card border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold gradient-text">
            Collab0rators
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Auth Button */}
            {authenticated ? (
              <button
                onClick={logout}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Logout
              </button>
            ) : (
              <button onClick={login} className="btn-primary px-4 py-2 text-sm">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
