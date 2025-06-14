"use client";

import { useState } from 'react';
import { Inter } from 'next/font/google';
import "./globals.css";
import { motion, AnimatePresence } from 'framer-motion';

// Import your SideNav component
import SideNav from './ui/SideNav';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedWrapper } from './components/ProtectedWrapper';
import { MusicProvider } from './contexts/MusicContext';
import { MusicDisk } from './ui';

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} antialiased bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen overflow-x-hidden`}>
        <AuthProvider>
          <MusicProvider>
            <ProtectedWrapper>
              {/* Mobile-optimized toggle button */}
              <AnimatePresence>
                {!isSidebarOpen && (
                  <motion.button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-40 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white/90 transition-colors touch-manipulation"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ touchAction: 'manipulation' }}
                    aria-label="Toggle navigation"
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
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Show sidebar when open */}
              <SideNav isOpen={isSidebarOpen} onClose={closeSidebar} />

              {/* Main content - Mobile responsive */}
              <div className={`min-h-screen w-full transition-all duration-300 ${isSidebarOpen ? 'lg:pl-80' : ''}`}>
                <div className="relative w-full">
                  {children}
                </div>
              </div>

              {/* Mobile overlay when sidebar is open */}
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeSidebar}
                  />
                )}
              </AnimatePresence>

              {/* Music Player Disk - Always visible */}
              <MusicDisk />
            </ProtectedWrapper>
          </MusicProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
