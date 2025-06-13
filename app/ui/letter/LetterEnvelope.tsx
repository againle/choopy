'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Letter {
  id: string;
  time: string;
  title: string;
  content: string;
  state: 'read' | 'not read';
}

interface LetterEnvelopeProps {
  letter: Letter;
  onClick: () => void;
}

export default function LetterEnvelope({ letter, onClick }: LetterEnvelopeProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
      
      {/* Envelope Animation Container */}
      <motion.div
        className="relative z-10 max-w-full"
        initial={{ x: -200, y: 100, scale: 0.5, rotate: -45 }}
        animate={{ x: 0, y: 0, scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 1.2
        }}
      >
        <motion.div
          className="cursor-pointer relative touch-manipulation"
          onClick={onClick}
          whileHover={{ scale: 1.05, y: -10 }}
          whileTap={{ scale: 0.95 }}
          style={{ touchAction: 'manipulation' }}
        >
          {/* Envelope Body */}
          <div className="w-64 h-40 sm:w-72 sm:h-48 md:w-80 md:h-56 bg-gradient-to-br from-cream-100 to-cream-200 border-2 border-amber-300 rounded-lg shadow-2xl relative overflow-hidden">
            {/* Envelope Flap */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-20 sm:h-24 md:h-28"
              style={{
                background: 'linear-gradient(135deg, #f3e8d3 0%, #e8d5b7 100%)',
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: letter.state === 'not read' ? 0 : -30 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Wax Seal */}
            {letter.state === 'not read' && (
              <motion.div
                className="absolute top-12 sm:top-14 md:top-16 left-1/2 transform -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-red-600 rounded-full border-2 border-red-800 flex items-center justify-center z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                <span className="text-white text-sm sm:text-base md:text-lg">💌</span>
              </motion.div>
            )}
            
            {/* Envelope Address Area */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8">
              <div className="space-y-1 sm:space-y-2">
                <div className="h-1.5 sm:h-2 bg-amber-400 rounded-full w-3/4 opacity-60"></div>
                <div className="h-1.5 sm:h-2 bg-amber-400 rounded-full w-1/2 opacity-40"></div>
                <div className="h-1.5 sm:h-2 bg-amber-400 rounded-full w-2/3 opacity-50"></div>
              </div>
            </div>
            
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 border-2 border-amber-600 rounded-full"></div>
              <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 border-2 border-amber-600 rounded-full"></div>
            </div>
            
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </div>
          
          {/* Shadow */}
          <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 w-64 h-40 sm:w-72 sm:h-48 md:w-80 md:h-56 bg-black opacity-10 rounded-lg -z-10 blur-sm" />
          
          {/* Floating sparkles */}
          {letter.state === 'not read' && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                  style={{
                    top: `${10 + Math.random() * 80}%`,
                    left: `${10 + Math.random() * 80}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0],
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
        </motion.div>
        
        {/* Instruction Text */}
        <motion.p
          className="text-center mt-4 sm:mt-6 text-amber-800 font-semibold text-base sm:text-lg px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          ✉️ Click to open the letter ✉️
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
