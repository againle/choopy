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

interface LetterContentProps {
  letter: Letter;
  onClose: () => void;
}

export default function LetterContent({ letter, onClose }: LetterContentProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleScroll = () => {
    // Handle scroll if needed in the future
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />
      
      {/* Letter Paper Container - Mobile Responsive */}
      <motion.div
        className="relative w-full max-w-3xl h-[90vh] sm:h-[85vh] bg-white shadow-2xl overflow-hidden rounded-lg mx-2 sm:mx-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229, 231, 235, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '20px 28px',
          backgroundPosition: '40px 60px'
        }}
        initial={{ scale: 0.3, rotateY: -90 }}
        animate={{ scale: 1, rotateY: 0 }}
        exit={{ scale: 0.3, rotateY: 90 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          duration: 0.8
        }}
      >
        {/* Paper texture - simplified */}
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Left margin line */}
        <div className="absolute left-8 sm:left-16 top-0 bottom-0 w-0.5 bg-blue-300 opacity-60 z-10"></div>
        
        {/* Top margin line */}
        <div className="absolute top-12 sm:top-20 left-0 right-0 h-0.5 bg-blue-300 opacity-50 z-10"></div>
        
        {/* Close Button - Mobile Optimized */}
        <motion.button
          className="absolute top-3 right-3 sm:top-6 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer touch-manipulation"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.5 }}
          style={{ 
            pointerEvents: 'auto',
            touchAction: 'manipulation'
          }}
        >
          <span className="text-sm sm:text-base font-bold leading-none select-none">✕</span>
        </motion.button>

        {/* Download Button - Mobile Optimized */}
        <motion.button
          className="absolute top-3 right-16 sm:top-6 sm:right-20 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer touch-manipulation"
          onClick={() => {
            // Handle download with proper path resolution for static builds
            const handleDownload = async () => {
              try {
                // Try multiple possible paths for the docx file
                const possiblePaths = [
                  `/choopy/download/${letter.id}.docx`,  // With basePath
                  `/download/${letter.id}.docx`,         // Without basePath
                  `./download/${letter.id}.docx`,        // Relative path
                ];
                
                let downloadUrl = '';
                
                for (const path of possiblePaths) {
                  try {
                    const response = await fetch(path, { method: 'HEAD' });
                    if (response.ok) {
                      downloadUrl = path;
                      break;
                    }
                  } catch {
                    continue;
                  }
                }
                
                if (downloadUrl) {
                  const link = document.createElement('a');
                  link.href = downloadUrl;
                  link.download = `${letter.id}.docx`;
                  link.target = '_blank'; // Open in new tab as fallback
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else {
                  // Fallback: try to open the file directly
                  window.open(`/download/${letter.id}.docx`, '_blank');
                }
              } catch (error) {
                console.error('Download failed:', error);
                // Final fallback: try to open the file directly
                window.open(`/download/${letter.id}.docx`, '_blank');
              }
            };
            
            handleDownload();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.6 }}
          style={{ 
            pointerEvents: 'auto',
            touchAction: 'manipulation'
          }}
          title="Download letter"
        >
          <span className="text-sm sm:text-base font-bold leading-none select-none">⬇</span>
        </motion.button>
        
        {/* Scrollable Content Container - Mobile Responsive */}
        <div 
          className="relative z-20 h-full overflow-y-auto px-6 sm:px-12 lg:px-20 py-16 sm:py-24 scroll-smooth"
          onScroll={handleScroll}
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Letter Date */}
          <motion.div
            className="text-right mb-6 sm:mb-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-600 text-xs sm:text-sm font-medium">
              {formatDate(letter.time)}
            </p>
          </motion.div>
          
          {/* Letter Greeting */}
          <motion.div
            className="mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            
          </motion.div>
          
          {/* Letter Content */}
          <motion.div
            className="text-gray-800 leading-relaxed font-serif"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {letter.content.split('\n').map((paragraph, index) => (
              <motion.p
                key={index}
                className={`mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-6 sm:leading-8 ${
                  index === 0 
                    ? 'first-letter:text-3xl sm:first-letter:text-4xl lg:first-letter:text-5xl first-letter:font-bold first-letter:text-gray-700 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-none first-letter:font-serif' 
                    : ''
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                style={{
                  textIndent: index === 0 ? '0' : '1rem',
                  lineHeight: '1.6rem',
                  marginBottom: '1rem'
                }}
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>
          
          {/* Letter Closing */}
          <motion.div
            className="mt-8 sm:mt-12 mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
          </motion.div>
          
          {/* Letter Signature Area */}
          <motion.div
            className="mt-6 sm:mt-8 mb-8 sm:mb-12 text-right"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="w-32 sm:w-48 h-0.5 bg-gray-400 ml-auto mb-4"></div>
          </motion.div>
          
          {/* Bottom spacing for scroll */}
          <div className="h-16 sm:h-20"></div>
        </div>
        
        {/* Paper shadow and depth */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 shadow-inner" style={{
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
          }} />
        </div>
        
        {/* Paper edge effects */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-r from-gray-200 to-transparent opacity-50"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-l from-gray-200 to-transparent opacity-30"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-gray-200 to-transparent opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-gray-200 to-transparent opacity-50"></div>
      </motion.div>
    </motion.div>
  );
}
