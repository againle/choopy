"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface PasswordModalProps {
  isOpen: boolean;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen }) => {
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const { login } = useAuth();

  // Reset password when modal opens
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setIsError(false);
      setIsShaking(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    
    if (!success) {
      setIsError(true);
      setIsShaking(true);
      setPassword('');
      
      // Reset error state after animation
      setTimeout(() => {
        setIsError(false);
        setIsShaking(false);
      }, 600);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (isError) {
      setIsError(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-sm"
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => {
              // Use deterministic values based on index to avoid hydration mismatch
              const x = (i * 47) % 800; // Pseudo-random but deterministic
              const y = (i * 73) % 600;
              const duration = (i % 3) + 2; // 2-4 seconds
              const delay = (i % 5) * 0.4; // 0-2 seconds
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  initial={{
                    x: x,
                    y: y,
                  }}
                  animate={{
                    y: [null, -100],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: duration,
                    repeat: Infinity,
                    delay: delay,
                  }}
                />
              );
            })}
          </div>

          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 50 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              x: isShaking ? [-10, 10, -10, 10, 0] : 0 
            }}
            exit={{ scale: 0.7, opacity: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200,
              x: { duration: 0.6 }
            }}
            className="relative bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4"
          >
            {/* Title */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            
              </h2>
              <p className="text-gray-600">
              
              </p>
            </motion.div>

            {/* Single Row Form with Lock, Input, and Button */}
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                {/* Lock icon */}
                <motion.div
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="flex-shrink-0 mt-1"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg 
                      className="w-7 h-7 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 0 00-8 0v4h8z" 
                      />
                    </svg>
                  </div>
                </motion.div>

                {/* Input field */}
                <div className="flex-1 relative">
                  <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter password"
                    className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 text-center text-lg tracking-widest ${
                      isError 
                        ? 'border-red-400 bg-red-50' 
                        : 'border-gray-200 focus:border-purple-400 focus:bg-white'
                    }`}
                    autoFocus
                  />
                  
                  {/* Password dots indicator */}
                  <div className="flex justify-center mt-2 space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ 
                          scale: i < password.length ? 1 : 0.3,
                          backgroundColor: i < password.length 
                            ? (isError ? '#EF4444' : '#8B5CF6') 
                            : '#E5E7EB'
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 200, 
                          damping: 20,
                          delay: i * 0.1 
                        }}
                        className="w-2 h-2 rounded-full"
                      />
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={password.length === 0}
                  whileHover={{ scale: password.length > 0 ? 1.05 : 1 }}
                  whileTap={{ scale: password.length > 0 ? 0.95 : 1 }}
                  className={`flex-shrink-0 w-14 h-14 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center mt-1 ${
                    password.length > 0
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    ✨
                  </motion.span>
                </motion.button>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {isError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-center text-sm"
                  >
                    ❌ Incorrect password. Please try again.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>

            {/* Footer hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-6 text-xs text-gray-400"
            >
              
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
