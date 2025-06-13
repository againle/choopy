"use client";

import { useState } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import "./globals.css";
import { motion, AnimatePresence } from 'framer-motion';

// Import your SideNav component
import SideNav from './ui/SideNav';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen`}>
        {/* Beautiful toggle button */}
        <AnimatePresence>
          {!isSidebarOpen && (
            <motion.button
              onClick={toggleSidebar}
              className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-sm hover:bg-white border border-white/20 p-3 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 group"
              aria-label="Toggle navigation"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                <motion.div
                  className="w-5 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-1"
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="w-4 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-1 opacity-75"
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
                <motion.div
                  className="w-3 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-50"
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
              </div>
              
              {/* Floating sparkles */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Show sidebar when open */}
        <SideNav isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main content */}
        <motion.div
          className="min-h-screen"
          animate={{
            paddingLeft: isSidebarOpen ? "320px" : "0px",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="relative">
            {children}
          </div>
        </motion.div>
      </body>
    </html>
  );
}
