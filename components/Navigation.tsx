"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MenuIcon, XIcon, AppleIcon, SmartphoneIcon } from "lucide-react";
import { Button } from "./Button";
import { useBookingStore } from "@/lib/store/useBookingStore";

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

export function Navigation() {
  const { setModalOpen } = useBookingStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolledDeep, setIsScrolledDeep] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setIsScrolledDeep(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${isScrolled 
            ? "bg-black/95 backdrop-blur-md shadow-lg border-b border-white/5" 
            : "bg-transparent"
          }
        `}
      >
        {/* Row 1: Logo, Menu & Auth */}
        <div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Luxeridex Logo"
                  className="h-16 sm:h-24 w-auto transition-all duration-500 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:scale-110 active:scale-95"
                />
              </Link>

              {/* Desktop Menu Links */}
              <div className="hidden lg:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                      ${pathname === link.path
                        ? "text-primary bg-white/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Desktop Auth */}
              <div className="hidden sm:flex items-center space-x-4">
                <Link href="/login">
                  <Button className="px-5 py-2 font-bold bg-[#1A1A1B] text-[#D4AF37] hover:bg-black border border-white/5 rounded-[14px] transition-all duration-300 shadow-sm" size="sm">
                    Log In
                  </Button>
                </Link>
                <Button 
                  onClick={() => setModalOpen(true)}
                  variant="primary" 
                  size="sm" 
                  className="px-7 py-2.5 font-bold text-white rounded-2xl shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-all duration-300"
                >
                  Book Now
                </Button>
                
                {/* Mobile Hamburger (visible on mobile only) */}
                <div className="lg:hidden ml-2">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
                  >
                    {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* Mobile-only menu button (if Log In is hidden) */}
              <div className="sm:hidden flex items-center">
                 <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
                  >
                    {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                  </button>
              </div>
            </div>
          </div>
        </div>

      </header>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden pt-32 bg-black/98 backdrop-blur-md overflow-y-auto"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`
                    block px-4 py-3 rounded-lg text-lg font-medium transition-colors
                    ${pathname === link.path
                      ? "text-primary bg-white/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                <Link href="/login">
                  <Button className="bg-[#1A1A1B] text-[#D4AF37] border border-white/5 rounded-[14px]" size="lg" fullWidth>Log In</Button>
                </Link>
                <div className="flex justify-center gap-4 py-4">
                   <AppleIcon className="w-6 h-6 text-gray-400" />
                   <SmartphoneIcon className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
