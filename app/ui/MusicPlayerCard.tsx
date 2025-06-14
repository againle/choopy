'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useMusic } from '../contexts/MusicContext';
import { PlayMode } from '../utils/musicUtils';

interface MusicPlayerCardProps {
  onClose: () => void;
}

export default function MusicPlayerCard({ onClose }: MusicPlayerCardProps) {
  const { state, groups, actions } = useMusic();
  const [activeTab, setActiveTab] = useState<'player' | 'playlist' | 'groups'>('player');

  const playModeIcons = {
    order: 'Sequential',
    random: 'Shuffle', 
    'repeat-one': 'Repeat',
  };

  const handlePlayModeToggle = () => {
    const modes: PlayMode[] = ['order', 'random', 'repeat-one'];
    const currentIndex = modes.indexOf(state.playMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    actions.setPlayMode(nextMode);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    actions.reorderPlaylist(result.source.index, result.destination.index);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 p-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Music Player
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex mt-4 space-x-1 bg-black/20 rounded-lg p-1">
            {[
              { id: 'player', label: 'Player', key: 'player' },
              { id: 'playlist', label: 'Playlist', key: 'playlist' },
              { id: 'groups', label: 'Library', key: 'groups' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 px-3 py-2 rounded-md text-sm transition-all ${
                  activeTab === tab.key
                    ? 'bg-white/30 text-white shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 max-h-96 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Player Tab */}
            {activeTab === 'player' && (
              <motion.div
                key="player"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Current Track Display */}
                <div className="text-center bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6">
                  {state.currentTrack ? (
                    <div>
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                        {state.currentTrack.title}
                      </h3>
                      {state.currentTrack.artist && (
                        <p className="text-gray-600 truncate">{state.currentTrack.artist}</p>
                      )}
                      <div className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                        {state.currentTrack.group}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                      </div>
                      <p className="font-medium">No track selected</p>
                      <p className="text-sm mt-1">Choose music from library or playlist</p>
                    </div>
                  )}
                </div>

                {/* Professional Music Controls */}
                <div className="flex items-center justify-center space-x-3">
                  <motion.button
                    onClick={actions.previous}
                    className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={state.playlist.length === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-700">
                      <path d="M15.5 4v16l-7-8 7-8z" fill="currentColor"/>
                      <path d="M6 4h2v16H6z" fill="currentColor"/>
                    </svg>
                  </motion.button>

                  <motion.button
                    onClick={state.isPlaying ? actions.pause : actions.play}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 flex items-center justify-center transition-all shadow-xl text-white disabled:opacity-50"
                    disabled={state.playlist.length === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {state.isPlaying ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6 4h4v16H6z" fill="currentColor"/>
                        <path d="M14 4h4v16h-4z" fill="currentColor"/>
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5v14l11-7z" fill="currentColor"/>
                      </svg>
                    )}
                  </motion.button>

                  <motion.button
                    onClick={actions.next}
                    className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={state.playlist.length === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-700">
                      <path d="M8.5 4v16l7-8-7-8z" fill="currentColor"/>
                      <path d="M16 4h2v16h-2z" fill="currentColor"/>
                    </svg>
                  </motion.button>
                </div>

                {/* Play Mode and Volume Controls */}
                <div className="space-y-4">
                  {/* Play Mode */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Mode:</span>
                    <motion.button
                      onClick={handlePlayModeToggle}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {playModeIcons[state.playMode]}
                      </span>
                    </motion.button>
                  </div>

                  {/* Volume Control */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Volume:</span>
                      <span className="text-sm font-bold text-gray-800">
                        {Math.round(state.volume * 100)}%
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={state.volume}
                        onChange={(e) => actions.setVolume(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #475569 0%, #64748b ${state.volume * 100}%, #e5e7eb ${state.volume * 100}%, #e5e7eb 100%)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Playlist Tab with Drag and Drop */}
            {activeTab === 'playlist' && (
              <motion.div
                key="playlist"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    Current Playlist
                    <span className="text-sm bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                      {state.playlist.length} tracks
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Drag tracks to reorder</p>
                </div>

                {state.playlist.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                        <path d="M12 2v20M17 7l-5-5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="font-medium">No tracks in playlist</p>
                    <p className="text-sm mt-1">Select music groups to build your playlist</p>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="playlist">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2 max-h-64 overflow-y-auto music-scroll"
                        >
                          {state.playlist.map((track, index) => (
                            <Draggable key={track.id} draggableId={track.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                                    state.currentTrack?.id === track.id
                                      ? 'bg-gradient-to-r from-slate-100 to-gray-100 border-2 border-slate-300 shadow-md'
                                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                  } ${
                                    snapshot.isDragging ? 'shadow-lg rotate-2 scale-105' : ''
                                  }`}
                                  onClick={() => actions.setTrack(track, index)}
                                  style={provided.draggableProps.style}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="text-lg flex items-center justify-center w-8 h-8">
                                      {state.currentTrack?.id === track.id && state.isPlaying ? (
                                        <div className="w-4 h-4 bg-slate-600 rounded-full animate-pulse"></div>
                                      ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-gray-800 truncate">
                                        {track.title}
                                      </div>
                                      {track.artist && (
                                        <div className="text-sm text-gray-600 truncate">
                                          {track.artist}
                                        </div>
                                      )}
                                      <div className="text-xs text-slate-600 bg-slate-50 inline-block px-2 py-1 rounded-full mt-1">
                                        {track.group}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="text-sm font-bold text-gray-400 bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">
                                        {index + 1}
                                      </div>
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                                        <path d="M8 6h8M8 12h8M8 18h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </motion.div>
            )}

            {/* Groups Tab */}
            {activeTab === 'groups' && (
              <motion.div
                key="groups"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    Music Library
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {state.selectedGroups.length} selected
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Select groups to build your playlist
                  </p>
                </div>

                {groups.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="font-medium">No music groups found</p>
                    <p className="text-sm mt-1">Add music files to public/music/</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {groups.map((group, index) => (
                      <motion.div
                        key={group.name}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                          state.selectedGroups.includes(group.name)
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 shadow-md'
                            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                        }`}
                        onClick={() => actions.toggleGroup(group.name)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">
                              {state.selectedGroups.includes(group.name) ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-600">
                                  <circle cx="12" cy="12" r="10" fill="currentColor"/>
                                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {group.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {group.tracks.length} track{group.tracks.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              state.selectedGroups.includes(group.name) 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {state.selectedGroups.includes(group.name) ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer with current status */}
        <div className="border-t border-gray-200 p-3 bg-gray-50/50">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${state.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>{state.isPlaying ? 'Playing' : 'Paused'}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{state.playlist.length} tracks loaded</span>
              <span>{playModeIcons[state.playMode]}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
