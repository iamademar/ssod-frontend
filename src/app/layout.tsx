import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import { Heart } from 'lucide-react'; 

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Study Space Occupancy Detector",
  description: "Check the availability of study spaces",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 min-h-screen flex flex-col`}>
        {/* Sticky Navbar */}
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-10">
          <h1 className="text-2xl font-bold text-rose-500 text-center" style={{ fontFamily: 'Circular, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif' }}>Study Space Occupancy Detector</h1>
        </div>

        {/* Content container with top padding to account for fixed navbar */}
        <div className="flex-grow max-w-5xl mx-auto pt-20 px-4 pb-16">
          {children}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="flex justify-center items-center text-gray-600">
            <span className="mr-1">Made with</span>
            <Heart className="text-rose-500 mx-1" size={16} />
            <span className="ml-1">by Team South Pole</span>
          </div>
        </footer>
      </body>
    </html>
  );
}