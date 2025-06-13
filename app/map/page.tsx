'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageLayout } from '../ui';

export default function MapPage() {
  return (
    <PageLayout 
      title="🗺️ Choopy Map Hub" 
      subtitle="Explore magical destinations and discover new adventures"
      backgroundColor="bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Letters Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Link href="/map/letter">
              <motion.div 
                className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 cursor-pointer border border-white/30 group relative overflow-hidden"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100/20 to-pink-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="text-center relative z-10">
                  <motion.div 
                    className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-500"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📮
                  </motion.div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4 group-hover:from-rose-500 group-hover:to-pink-500 transition-all duration-300">
                    Letters
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Read heartfelt letters from friends and discover beautiful messages waiting for you.
                  </p>
                  
                  {/* Floating sparkles */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-yellow-400 text-xl"
                    >
                      ✨
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
          
          {/* Adventure Map - Coming Soon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20 relative overflow-hidden group"
              whileHover={{ scale: 1.01 }}
            >
              {/* Coming soon overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100/40 to-gray-200/40"></div>
              <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-sm font-semibold">
                Soon
              </div>
              
              <div className="text-center relative z-10 opacity-70">
                <div className="text-7xl mb-6 filter grayscale">🏞️</div>
                <h2 className="text-3xl font-bold text-gray-500 mb-4">
                  Adventure Map
                </h2>
                <p className="text-gray-500 leading-relaxed text-lg">
                  Coming soon... Explore magical locations and hidden treasures.
                </p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Quests - Coming Soon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20 relative overflow-hidden group"
              whileHover={{ scale: 1.01 }}
            >
              {/* Coming soon overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100/40 to-gray-200/40"></div>
              <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-sm font-semibold">
                Soon
              </div>
              
              <div className="text-center relative z-10 opacity-70">
                <div className="text-7xl mb-6 filter grayscale">🎯</div>
                <h2 className="text-3xl font-bold text-gray-500 mb-4">
                  Quests
                </h2>
                <p className="text-gray-500 leading-relaxed text-lg">
                  Coming soon... Embark on exciting quests and challenges.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Back to Home */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/">
            <motion.div
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">🏠</span>
              Back to Home
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </PageLayout>
  );
}