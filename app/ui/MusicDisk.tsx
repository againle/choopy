'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../contexts/MusicContext';
import { useAuth } from '../contexts/AuthContext';
import MusicPlayerCard from './MusicPlayerCard';

export default function MusicDisk() {
  const { state } = useMusic();
  const { isAuthenticated } = useAuth();
  const [showPlayer, setShowPlayer] = useState(false);

  const handleDiskClick = () => {
    if (isAuthenticated) {
      setShowPlayer(true);
    }
  };

  return (
    <>
      {/* Floating Music Disk */}
      <motion.div
        className="fixed bottom-6 right-6 z-40 cursor-pointer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        onClick={handleDiskClick}
      >
        <motion.div
          className="relative w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
          animate={{
            rotate: state.isPlaying ? 360 : 0,
          }}
          transition={{
            rotate: {
              duration: state.isPlaying ? 3 : 0,
              repeat: state.isPlaying ? Infinity : 0,
              ease: "linear",
            },
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Vinyl Record Design */}
          <div className="absolute inset-2 bg-black rounded-full">
            <div className="absolute inset-2 border-2 border-gray-600 rounded-full">
              <div className="absolute inset-2 border border-gray-500 rounded-full">
                <div className="absolute inset-4 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Music Note Icon */}
          <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
            {state.isPlaying ? '🎵' : '🎶'}
          </div>

          {/* Glow Effect */}
          {state.isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-400/30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Authentication Lock Indicator */}
          {!isAuthenticated && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs">
              🔒
            </div>
          )}
        </motion.div>

        {/* Current Track Info */}
        <AnimatePresence>
          {state.currentTrack && state.isPlaying && (
            <motion.div
              className="absolute bottom-full right-0 mb-2 max-w-48"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs">
                <div className="font-semibold truncate">{state.currentTrack.title}</div>
                {state.currentTrack.artist && (
                  <div className="text-gray-300 truncate">{state.currentTrack.artist}</div>
                )}
              </div>
              {/* Arrow pointing to disk */}
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black/80"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Music Player Card Modal */}
      <AnimatePresence>
        {showPlayer && isAuthenticated && (
          <MusicPlayerCard onClose={() => setShowPlayer(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
