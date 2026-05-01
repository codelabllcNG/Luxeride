"use client";

import React from "react";
import Link from "next/link";
import { AppleIcon, SmartphoneIcon } from "lucide-react";

import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "City Tours", path: "/city-tours" },
  { name: "Events", path: "/events" },
  { name: "Parties", path: "/parties" },
  { name: "Mobility", path: "/mobility-equipment" },
  { name: "Moving", path: "/moving-services" },
  { name: "Loading", path: "/loading" },
  { name: "Contact", path: "/contact" },
];

export function AppStoreBanner() {
  const pathname = usePathname();
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/98 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-[0.5rem] pb-[0.7rem] sm:py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Download Message */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink min-w-0">
            {/* Logo */}
            <Link href="/" className="flex items-center  flex-shrink-0 group">
              <img
                src="/logo.png"
                alt="Luxeridex Logo"
                className=" h-25 w-auto"
              />
            </Link>
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/30 flex-shrink-0">
              <SmartphoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-semibold text-gray-400 truncate">
                Download our App
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 hidden sm:block truncate">
                Book rides faster with our mobile app
              </div>
            </div>
          </div>

          {/* Right: Menu & Auth */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 mr-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`
                    px-2 py-1 rounded-md text-[13px] font-medium transition-colors whitespace-nowrap
                    ${pathname === link.path
                      ? "text-primary bg-white/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <Link
              href="/login"
              className="hidden md:flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-primary transition-colors flex-shrink-0"
            >
              <span className="text-xs sm:text-sm text-primary font-medium truncate">
                Log In
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
