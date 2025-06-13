'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LetterEnvelope, LetterContent, Mailbox, LetterGrid } from '../../ui';
import { loadAllLetters, getUnreadCount, getFirstUnreadLetter, type Letter } from '../../utils/letterUtils';

export default function LetterPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [viewMode, setViewMode] = useState<'random' | 'timeline'>('random');
  const [showMailbox, setShowMailbox] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLetters = async () => {
      try {
        setLoading(true);
        const loadedLetters = await loadAllLetters();
        
        setLetters(loadedLetters);
        const unread = getUnreadCount(loadedLetters);
        setUnreadCount(unread);
        setShowMailbox(unread > 0);
        setError(null);
      } catch (err) {
        console.error('Error loading letters:', err);
        setError('Failed to load letters. Please try refreshing the page.');
        // Set empty state on error
        setLetters([]);
        setUnreadCount(0);
        setShowMailbox(false);
      } finally {
        setLoading(false);
      }
    };

    loadLetters();
  }, []);

  const handleMailboxClick = () => {
    if (unreadCount > 0) {
      const firstUnread = getFirstUnreadLetter(letters);
      if (firstUnread) {
        setSelectedLetter(firstUnread);
        setShowEnvelope(true);
        setShowMailbox(false);
      }
    }
  };

  const handleEnvelopeClick = () => {
    if (selectedLetter) {
      showLetterContent(selectedLetter);
    }
  };

  const handleCloseContent = () => {
    setShowContent(false);
    setSelectedLetter(null);
    
    // Check if there are still unread letters
    const stillUnread = letters.filter(letter => letter.state === 'not read').length;
    if (stillUnread > 0) {
      setShowMailbox(true);
    }
  };

  const handleLetterSelect = (letter: Letter) => {
    setSelectedLetter(letter);
    if (letter.state === 'not read') {
      setShowEnvelope(true);
    } else {
      showLetterContent(letter);
    }
  };

  // Function to mark a letter as read when content is shown
  const markLetterAsRead = (letterId: string) => {
    setLetters(prev => prev.map(letter => 
      letter.id === letterId && letter.state === 'not read'
        ? { ...letter, state: 'read' as const }
        : letter
    ));
    
    // Update unread count
    setUnreadCount(prev => {
      const currentLetter = letters.find(l => l.id === letterId);
      return currentLetter?.state === 'not read' ? Math.max(0, prev - 1) : prev;
    });
  };

  // Enhanced content showing that marks letter as read
  const showLetterContent = (letter: Letter) => {
    setSelectedLetter(letter);
    setShowContent(true);
    setShowEnvelope(false);
    
    // Mark as read if it's unread
    if (letter.state === 'not read') {
      markLetterAsRead(letter.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 sm:w-32 h-20 sm:h-32 bg-rose-300 rounded-full blur-3xl"></div>
        <div className="absolute top-32 right-10 sm:right-20 w-16 sm:w-24 h-16 sm:h-24 bg-amber-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/3 w-24 sm:w-40 h-24 sm:h-40 bg-orange-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header - Mobile Responsive */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.h1 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-800 mb-4 px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            📮 Letters from the Heart
          </motion.h1>
          
          {/* Loading State */}
          {loading && (
            <motion.div
              className="flex justify-center items-center py-8 sm:py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-amber-600"></div>
              <span className="ml-3 text-amber-700 font-medium text-sm sm:text-base">Loading letters...</span>
            </motion.div>
          )}
          
          {/* Error State */}
          {error && (
            <motion.div
              className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 max-w-sm sm:max-w-md mx-auto text-sm sm:text-base"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="font-medium">⚠️ {error}</p>
            </motion.div>
          )}
          
          {!loading && !error && !showEnvelope && !showContent && (
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setViewMode('random')}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base touch-manipulation ${
                  viewMode === 'random'
                    ? 'bg-rose-400 text-white shadow-lg transform scale-105'
                    : 'bg-white text-rose-400 border-2 border-rose-400 hover:bg-rose-50'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                🎲 Random Scatter
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base touch-manipulation ${
                  viewMode === 'timeline'
                    ? 'bg-amber-400 text-white shadow-lg transform scale-105'
                    : 'bg-white text-amber-400 border-2 border-amber-400 hover:bg-amber-50'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                📅 Timeline View
              </button>
            </motion.div>
          )}
        </div>

        {/* Only show letter components when not loading and no error */}
        {!loading && !error && (
          <>
            {/* Mailbox for unread letters */}
            <AnimatePresence>
              {showMailbox && (
                <Mailbox 
                  unreadCount={unreadCount}
                  onClick={handleMailboxClick}
                />
              )}
            </AnimatePresence>

            {/* Letter Envelope */}
            <AnimatePresence>
              {showEnvelope && selectedLetter && (
                <LetterEnvelope 
                  letter={selectedLetter}
                  onClick={handleEnvelopeClick}
                />
              )}
            </AnimatePresence>

            {/* Letter Content */}
            <AnimatePresence>
              {showContent && selectedLetter && (
                <LetterContent 
                  letter={selectedLetter}
                  onClose={handleCloseContent}
                />
              )}
            </AnimatePresence>

            {/* Letters Grid/Random View */}
            {!showEnvelope && !showContent && !showMailbox && letters.length > 0 && (
              <LetterGrid 
                letters={letters}
                viewMode={viewMode}
                onLetterSelect={handleLetterSelect}
              />
            )}
            
            {/* Empty State */}
            {!showEnvelope && !showContent && !showMailbox && letters.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-6xl mb-4">📭</div>
                <p className="text-amber-700 text-lg">No letters found</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
