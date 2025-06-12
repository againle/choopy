"use client";

import { useState } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import "./globals.css";

// Import your SideNav component
import SideNav from './ui/SideNav';
import Image from 'next/image';

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
      <body className={`${inter.className} antialiased`}>
        {/* Toggle button fixed at top-left */}
        { !isSidebarOpen &&
          (<button
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
            style={{
              position: 'fixed',
              top: '10px',
              left: '10px',
              zIndex: 1100,
              background: '#fff',
              border: 'none',
              padding: '8px',
              borderRadius: '4px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            <Image
                className="dark:invert"
                src="/choopy/window.svg"
                alt="Signal"
                width={20}
                height={20}
              />
          </button>)
        }

        {/* Show sidebar when open */}
        {isSidebarOpen && (
          <SideNav onClose={closeSidebar} />
        )}

        {/* Overlay to close sidebar when clicking outside */}
        {isSidebarOpen && (
          <div
            onClick={closeSidebar}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 999,
            }}
          />
        )}

        {/* Main content */}
        <div style={{ paddingLeft: isSidebarOpen ? '250px' : '0', transition: 'padding-left 0.3s' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
