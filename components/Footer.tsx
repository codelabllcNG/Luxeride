"use client";

import React from "react";
import Link from "next/link";
import NextImage from "next/image";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from "lucide-react";

const footerLinks = {
  services: [
    {
      name: "Book a Limo Ride",
      path: "/limo-booking",
    },
    {
      name: "Logistics Services",
      path: "/logistics",
    },
    {
      name: "Events",
      path: "/events",
    },
    {
      name: "Parties",
      path: "/parties",
    },
  ],
  company: [
    {
      name: "About Us",
      path: "/about",
    },
    {
      name: "Partner With Us",
      path: "/partner",
    },
    {
      name: "Contact",
      path: "/contact",
    },
    {
      name: "Mobility Equipment",
      path: "/mobility-equipment",
    },
  ],
  legal: [
    {
      name: "Privacy Policy",
      path: "/privacy-policy",
    },
    {
      name: "Terms of Service",
      path: "#",
    },
    {
      name: "Cancellation Policy",
      path: "#",
    },
  ],
};

export function Footer() {
  return (
    <footer className="bg-dark-charcoal border-t border-dark-lighter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            {/* Logo */}
            <Link href="/" className="flex items-center  flex-shrink-0 group">
              <img
                src="/logo.png"
                alt="Luxeridex Logo"
                className=" h-25 w-auto"
              />
            </Link>
            <p className="text-grey-medium text-sm leading-relaxed">
              Premium luxury transportation and reliable logistics services
              across the DMV area. Experience excellence in every journey.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/luxridex"
                className="p-2 rounded-lg bg-dark-lighter text-grey-medium hover:text-primary hover:bg-dark transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/luxridexdmv/"
                className="p-2 rounded-lg bg-dark-lighter text-grey-medium hover:text-primary hover:bg-dark transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-lg font-semibold text-grey-pastel mb-6">
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-grey-medium hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-lg font-semibold text-grey-pastel mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-grey-medium hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-semibold text-grey-pastel mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPinIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-grey-medium text-sm">
                  2013 14th St NW, Washington, DC 20009, United States
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+12023551410"
                  className="text-grey-medium hover:text-primary transition-colors text-sm"
                >
                  (202) 355-1410
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <MailIcon className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:Info@luxridex.com"
                  className="text-grey-medium hover:text-primary transition-colors text-sm"
                >
                  Info@luxridex.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-dark-lighter">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-grey-medium text-sm">
              © {new Date().getFullYear()} Luxeridex. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className="text-grey-medium hover:text-primary transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
