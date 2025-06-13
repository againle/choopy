'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface SideNavProps {
  onClose?: () => void; 
  isOpen?: boolean;
}

const navItems = [
  { href: '/', label: 'Home', icon: '🏠', description: 'Welcome page' },
  { href: '/main', label: 'Main', icon: '⭐', description: 'Main content' },
  { href: '/map', label: 'Map', icon: '🗺️', description: 'Explore areas' },
  { href: '/map/letter', label: 'Letters', icon: '📮', description: 'Read messages' },
];

export default function SideNav({ onClose, isOpen = true }: SideNavProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            className="fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 shadow-2xl z-50 overflow-hidden"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute top-1/3 -right-16 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute bottom-20 left-10 w-28 h-28 bg-indigo-200 rounded-full opacity-20 blur-2xl"></div>
            </div>
            
            {/* Header */}
            <div className="relative p-6 border-b border-white/20">
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg">🌸</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Choopy
                    </h2>
                    <p className="text-sm text-gray-500">Navigation</p>
                  </div>
                </div>
                
                {/* Close button */}
                {onClose && (
                  <motion.button
                    className="w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="text-gray-600 text-sm">✕</span>
                  </motion.button>
                )}
              </motion.div>
            </div>
            
            {/* Navigation */}
            <nav className="p-6">
              <ul className="space-y-3">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/' && pathname.startsWith(item.href));
                  
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * (index + 1) }}
                    >
                      <Link href={item.href} onClick={onClose}>
                        <motion.div
                          className={`relative group flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                              : 'hover:bg-white/60 text-gray-700 hover:shadow-md'
                          }`}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              className="absolute left-0 top-1/2 w-1 h-8 bg-white rounded-r-full transform -translate-y-1/2"
                              layoutId="activeIndicator"
                            />
                          )}
                          
                          {/* Icon */}
                          <div className={`text-2xl transition-transform group-hover:scale-110 ${
                            isActive ? 'drop-shadow-sm' : ''
                          }`}>
                            {item.icon}
                          </div>
                          
                          {/* Text content */}
                          <div className="flex-1 min-w-0">
                            <div className={`font-semibold text-base ${
                              isActive ? 'text-white' : 'text-gray-800'
                            }`}>
                              {item.label}
                            </div>
                            <div className={`text-sm ${
                              isActive ? 'text-purple-100' : 'text-gray-500'
                            }`}>
                              {item.description}
                            </div>
                          </div>
                          
                          {/* Arrow indicator */}
                          <motion.div
                            className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                              isActive ? 'text-white' : 'text-gray-400'
                            }`}
                            animate={{ x: isActive ? 0 : -5 }}
                          >
                            →
                          </motion.div>
                        </motion.div>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
            
            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <motion.div
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">💫</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Welcome back!</p>
                    <p className="text-xs text-gray-500">Enjoy your journey</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
