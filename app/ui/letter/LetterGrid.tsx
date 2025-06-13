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

interface LetterGridProps {
  letters: Letter[];
  viewMode: 'random' | 'timeline';
  onLetterSelect: (letter: Letter) => void;
}

export default function LetterGrid({ letters, viewMode, onLetterSelect }: LetterGridProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRandomPosition = (index: number) => {
    // Create deterministic but random-looking positions
    const seed = index * 123;
    const x = (Math.sin(seed) * 40 + 50) + (Math.cos(seed * 2) * 20);
    const y = (Math.cos(seed) * 30 + 40) + (Math.sin(seed * 3) * 25);
    const rotation = Math.sin(seed * 1.5) * 15;
    
    return { x: `${Math.max(5, Math.min(85, x))}%`, y: `${Math.max(10, Math.min(80, y))}%`, rotation };
  };

  const sortedLetters = viewMode === 'timeline' 
    ? [...letters].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    : letters;

  if (viewMode === 'timeline') {
    return (
      <motion.div
        className="space-y-6 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {sortedLetters.map((letter, index) => (
          <motion.div
            key={letter.id}
            className="group"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border-l-4 border-amber-400 group-hover:border-rose-400"
              onClick={() => onLetterSelect(letter)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">
                      {letter.state === 'not read' ? '📩' : '📋'}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
                      {letter.title}
                    </h3>
                    {letter.state === 'not read' && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 line-clamp-2 mb-3">
                    {letter.content.split('\n')[0].substring(0, 150)}...
                  </p>
                  <p className="text-sm text-amber-600 font-medium">
                    {formatDate(letter.time)}
                  </p>
                </div>
                <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-amber-500">→</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative w-full h-[calc(100vh-200px)] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {letters.map((letter, index) => {
        const { x, y, rotation } = getRandomPosition(index);
        
        return (
          <motion.div
            key={letter.id}
            className="absolute cursor-pointer group"
            style={{ left: x, top: y }}
            initial={{ scale: 0, rotate: rotation + 180 }}
            animate={{ scale: 1, rotate: rotation }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
            whileHover={{ 
              scale: 1.1, 
              rotate: 0,
              zIndex: 10,
              transition: { duration: 0.2 }
            }}
            onClick={() => onLetterSelect(letter)}
          >
            {/* Letter Envelope */}
            <div className="relative transform-gpu">
              <div
                className={`w-24 h-16 rounded-lg shadow-lg transition-all duration-300 ${
                  letter.state === 'not read'
                    ? 'bg-gradient-to-br from-yellow-200 to-yellow-300 border-2 border-yellow-400'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300'
                }`}
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* Envelope Flap */}
                <div
                  className={`absolute top-0 left-0 right-0 h-8 ${
                    letter.state === 'not read'
                      ? 'bg-gradient-to-b from-yellow-300 to-yellow-400'
                      : 'bg-gradient-to-b from-gray-200 to-gray-300'
                  }`}
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  }}
                />
                
                {/* Unread Indicator */}
                {letter.state === 'not read' && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                
                {/* Letter Icon */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs">
                  {letter.state === 'not read' ? '✨' : '📄'}
                </div>
              </div>
              
              {/* Hover Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                  <div className="font-semibold">{letter.title}</div>
                  <div className="text-gray-300">{formatDate(letter.time)}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
              
              {/* Floating Animation for Unread */}
              {letter.state === 'not read' && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                />
              )}
            </div>
          </motion.div>
        );
      })}
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-300 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
