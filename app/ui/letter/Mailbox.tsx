'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MailboxProps {
  unreadCount: number;
  onClick: () => void;
}

export default function Mailbox({ unreadCount, onClick }: MailboxProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        duration: 0.8 
      }}
    >
      <motion.div
        className="relative cursor-pointer flex flex-col items-center"
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Mailbox Base */}
        <div className="w-32 h-40 bg-gradient-to-b from-blue-600 to-blue-800 rounded-t-3xl rounded-b-lg shadow-2xl relative">
          {/* Mailbox Door */}
          <motion.div
            className="absolute inset-x-2 top-8 bottom-4 bg-gradient-to-b from-blue-500 to-blue-700 rounded-2xl border-2 border-blue-400"
            animate={{ 
              rotateX: unreadCount > 0 ? -15 : 0,
            }}
            style={{
              transformOrigin: "bottom"
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Door Handle */}
            <div className="absolute right-2 top-1/2 w-2 h-4 bg-yellow-400 rounded-full transform -translate-y-1/2"></div>
            
            {/* Mail Slot */}
            <div className="absolute inset-x-4 top-6 h-1 bg-blue-900 rounded-full"></div>
          </motion.div>
          
          {/* Mailbox Flag */}
          {unreadCount > 0 && (
            <motion.div
              className="absolute -right-1 top-8 w-6 h-4 bg-red-500 rounded-r-lg"
              initial={{ x: -10 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-full h-full bg-gradient-to-r from-red-500 to-red-600 rounded-r-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">{unreadCount}</span>
              </div>
            </motion.div>
          )}
          
          {/* Mailbox Post */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-3 h-8 bg-brown-600 rounded-b-lg"></div>
        </div>
        
        {/* Floating particles around mailbox */}
        {unreadCount > 0 && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                style={{
                  top: `${20 + Math.sin(i) * 30}%`,
                  left: `${30 + Math.cos(i) * 40}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.6, 1, 0.6],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </>
        )}
        
        {/* Glow effect for unread letters */}
        {unreadCount > 0 && (
          <motion.div
            className="absolute inset-0 bg-yellow-400 rounded-t-3xl rounded-b-lg opacity-20 blur-xl"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        {/* Instruction text - now properly centered below mailbox */}
        {unreadCount > 0 && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <p className="text-amber-700 font-medium text-lg">
              ✨ You have new letters! Click to open ✨
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
