'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { 
  MusicTrack, 
  MusicGroup, 
  PlayMode, 
  PlaylistState,
  loadMusicIndex,
  createPlaylistFromGroups,
  removeGroupFromPlaylist,
  getNextTrack,
  getPreviousTrack
} from '../utils/musicUtils';

interface MusicContextType {
  state: PlaylistState;
  groups: MusicGroup[];
  audio: HTMLAudioElement | null;
  actions: {
    play: () => void;
    pause: () => void;
    next: () => void;
    previous: () => void;
    setTrack: (track: MusicTrack, index: number) => void;
    setPlayMode: (mode: PlayMode) => void;
    setVolume: (volume: number) => void;
    toggleGroup: (groupName: string) => void;
    setSelectedGroups: (groups: string[]) => void;
    reorderPlaylist: (startIndex: number, endIndex: number) => void;
  };
}

type MusicAction = 
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_CURRENT_TRACK'; payload: { track: MusicTrack | null; index: number } }
  | { type: 'SET_PLAYLIST'; payload: MusicTrack[] }
  | { type: 'SET_PLAY_MODE'; payload: PlayMode }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_SELECTED_GROUPS'; payload: string[] }
  | { type: 'TOGGLE_GROUP'; payload: string }
  | { type: 'REORDER_PLAYLIST'; payload: { startIndex: number; endIndex: number } };

const initialState: PlaylistState = {
  currentTrack: null,
  currentIndex: -1,
  playlist: [],
  selectedGroups: [],
  playMode: 'order',
  isPlaying: false,
  volume: 0.7,
};

function musicReducer(state: PlaylistState, action: MusicAction): PlaylistState {
  switch (action.type) {
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    
    case 'SET_CURRENT_TRACK':
      return {
        ...state,
        currentTrack: action.payload.track,
        currentIndex: action.payload.index,
      };
    
    case 'SET_PLAYLIST':
      return { ...state, playlist: action.payload };
    
    case 'SET_PLAY_MODE':
      return { ...state, playMode: action.payload };
    
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    
    case 'SET_SELECTED_GROUPS':
      return { ...state, selectedGroups: action.payload };
    
    case 'TOGGLE_GROUP':
      const groupName = action.payload;
      const isCurrentlySelected = state.selectedGroups.includes(groupName);
      let newSelectedGroups: string[];
      let newPlaylist: MusicTrack[];
      
      if (isCurrentlySelected) {
        // Remove group
        newSelectedGroups = state.selectedGroups.filter(g => g !== groupName);
        newPlaylist = removeGroupFromPlaylist(state.playlist, groupName);
      } else {
        // Add group
        newSelectedGroups = [...state.selectedGroups, groupName];
        // Find the groups array from context to get the actual group data
        // For now, we'll use the simple approach and let the effect handle it
        newPlaylist = state.playlist;
      }
      
      return { 
        ...state, 
        selectedGroups: newSelectedGroups,
        playlist: isCurrentlySelected ? newPlaylist : state.playlist
      };
    
    case 'REORDER_PLAYLIST': {
      const { startIndex, endIndex } = action.payload;
      const newPlaylist = [...state.playlist];
      const [movedTrack] = newPlaylist.splice(startIndex, 1);
      newPlaylist.splice(endIndex, 0, movedTrack);
      return { ...state, playlist: newPlaylist };
    }
    
    default:
      return state;
  }
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(musicReducer, initialState);
  const [groups, setGroups] = React.useState<MusicGroup[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = state.volume;
    
    const audio = audioRef.current;
    
    // Audio event listeners
    const handlePlay = () => dispatch({ type: 'SET_PLAYING', payload: true });
    const handlePause = () => dispatch({ type: 'SET_PLAYING', payload: false });
    const handleEnded = () => {
      // Auto play next track when current ends (except in repeat-one mode)
      if (state.playMode !== 'repeat-one') {
        const next = getNextTrack(state.playlist, state.currentIndex, state.playMode);
        if (next.track) {
          dispatch({ type: 'SET_CURRENT_TRACK', payload: { track: next.track, index: next.index } });
        }
      }
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  // Load music groups on mount
  useEffect(() => {
    const loadMusic = async () => {
      try {
        const musicGroups = await loadMusicIndex();
        setGroups(musicGroups);
        
        // Auto-select first group if available
        if (musicGroups.length > 0) {
          dispatch({ type: 'SET_SELECTED_GROUPS', payload: [musicGroups[0].name] });
        }
      } catch (error) {
        console.error('Failed to load music:', error);
      }
    };

    loadMusic();
  }, []);

  // Update playlist when selected groups change
  useEffect(() => {
    const newPlaylist = createPlaylistFromGroups(groups, state.selectedGroups);
    dispatch({ type: 'SET_PLAYLIST', payload: newPlaylist });
    
    // Reset current track if it's not in the new playlist
    if (state.currentTrack && !newPlaylist.find(track => track.id === state.currentTrack?.id)) {
      dispatch({ type: 'SET_CURRENT_TRACK', payload: { track: null, index: -1 } });
    }
  }, [groups, state.selectedGroups, state.currentTrack]);

  // Update audio source when current track changes
  useEffect(() => {
    if (audioRef.current && state.currentTrack) {
      const basePaths = ['/choopy/music/', '/music/', './music/'];
      let audioPath = '';
      
      for (const basePath of basePaths) {
        audioPath = `${basePath}${state.currentTrack.group}/${state.currentTrack.filename}`;
        break; // Use first path format for now
      }
      
      audioRef.current.src = audioPath;
      
      if (state.isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [state.currentTrack, state.isPlaying]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  const actions = {
    play: () => {
      if (audioRef.current) {
        if (state.currentTrack) {
          audioRef.current.play().catch(console.error);
        } else if (state.playlist.length > 0) {
          // Start playing first track if no current track
          dispatch({ type: 'SET_CURRENT_TRACK', payload: { track: state.playlist[0], index: 0 } });
        }
      }
    },

    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    },

    next: () => {
      const next = getNextTrack(state.playlist, state.currentIndex, state.playMode);
      if (next.track) {
        dispatch({ type: 'SET_CURRENT_TRACK', payload: { track: next.track, index: next.index } });
      }
    },

    previous: () => {
      const prev = getPreviousTrack(state.playlist, state.currentIndex);
      if (prev.track) {
        dispatch({ type: 'SET_CURRENT_TRACK', payload: { track: prev.track, index: prev.index } });
      }
    },

    setTrack: (track: MusicTrack, index: number) => {
      dispatch({ type: 'SET_CURRENT_TRACK', payload: { track, index } });
    },

    setPlayMode: (mode: PlayMode) => {
      dispatch({ type: 'SET_PLAY_MODE', payload: mode });
    },

    setVolume: (volume: number) => {
      dispatch({ type: 'SET_VOLUME', payload: Math.max(0, Math.min(1, volume)) });
    },

    toggleGroup: (groupName: string) => {
      dispatch({ type: 'TOGGLE_GROUP', payload: groupName });
    },

    setSelectedGroups: (groups: string[]) => {
      dispatch({ type: 'SET_SELECTED_GROUPS', payload: groups });
    },

    reorderPlaylist: (startIndex: number, endIndex: number) => {
      dispatch({ type: 'REORDER_PLAYLIST', payload: { startIndex, endIndex } });
    },
  };

  return (
    <MusicContext.Provider value={{ state, groups, audio: audioRef.current, actions }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
