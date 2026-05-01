import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {Toaster} from 'sonner'
import { AppStoreBanner } from "@/components/AppStoreBanner";
import { GlobalBookingModal } from "@/components/booking/GlobalBookingModal";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luxridex",
  description: "Premium luxury transportation and reliable logistics services designed for comfort, safety, and convenience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        {children}
        <Toaster
              position="top-right"
              richColors
              toastOptions={{
              style: {
                    background: "#0E0E0E",    
                    color: "#F5F5F5",  
                    border: 'none',          
                    },
                   
            }}
/>
        <GlobalBookingModal />
        <Footer />
      </body>
    </html>
  );
}
