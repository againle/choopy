'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  description?: string;
}

interface NavigationProps {
  items: NavItem[];
  title?: string;
}

export default function Navigation({ items, title = "Navigation" }: NavigationProps) {
  return (
    <motion.nav
      className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/30 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-200 rounded-full opacity-20 blur-xl"></div>
      </div>
      
      {title && (
        <motion.h2 
          className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center relative z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h2>
      )}
      
      <div className="space-y-4 relative z-10">
        {items.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
          >
            <Link href={item.href}>
              <motion.div 
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 hover:bg-white/80 transition-all duration-300 group cursor-pointer border border-white/20 hover:border-purple-200 hover:shadow-lg"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors text-lg">
                    {item.label}
                  </div>
                  {item.description && (
                    <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                      {item.description}
                    </div>
                  )}
                </div>
                <motion.div
                  className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {/* Bottom decorative element */}
      <motion.div
        className="flex justify-center mt-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}
