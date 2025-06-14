// Music player utility functions
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  filename: string;
  group: string;
  duration?: number;
}

export interface MusicGroup {
  name: string;
  tracks: MusicTrack[];
}

export type PlayMode = 'order' | 'random' | 'repeat-one';

export interface PlaylistState {
  currentTrack: MusicTrack | null;
  currentIndex: number;
  playlist: MusicTrack[];
  selectedGroups: string[];
  playMode: PlayMode;
  isPlaying: boolean;
  volume: number;
}

/**
 * Load music index from public/music directory
 */
export async function loadMusicIndex(): Promise<MusicGroup[]> {
  try {
    const possiblePaths = [
      '/choopy/music/index.json',
      '/music/index.json',
      './music/index.json',
    ];
    
    for (const path of possiblePaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          return data.groups || [];
        }
      } catch {
        continue;
      }
    }
    
    // Return empty array if no index found
    return [];
  } catch (error) {
    console.error('Error loading music index:', error);
    return [];
  }
}

/**
 * Create playlist from selected groups, maintaining order
 */
export function createPlaylistFromGroups(groups: MusicGroup[], selectedGroupNames: string[]): MusicTrack[] {
  const playlist: MusicTrack[] = [];
  
  selectedGroupNames.forEach(groupName => {
    const group = groups.find(g => g.name === groupName);
    if (group) {
      playlist.push(...group.tracks);
    }
  });
  
  return playlist;
}

/**
 * Add tracks from a new group to the end of existing playlist
 */
export function addGroupToPlaylist(currentPlaylist: MusicTrack[], groups: MusicGroup[], groupName: string): MusicTrack[] {
  const group = groups.find(g => g.name === groupName);
  if (!group) return currentPlaylist;
  
  // Filter out any existing tracks from this group first
  const filteredPlaylist = currentPlaylist.filter(track => track.group !== groupName);
  
  // Add new tracks to the end
  return [...filteredPlaylist, ...group.tracks];
}

/**
 * Remove all tracks from a specific group while maintaining order
 */
export function removeGroupFromPlaylist(currentPlaylist: MusicTrack[], groupName: string): MusicTrack[] {
  return currentPlaylist.filter(track => track.group !== groupName);
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get next track based on play mode
 */
export function getNextTrack(
  playlist: MusicTrack[], 
  currentIndex: number, 
  playMode: PlayMode
): { track: MusicTrack | null; index: number } {
  if (playlist.length === 0) {
    return { track: null, index: -1 };
  }
  
  switch (playMode) {
    case 'repeat-one':
      return { track: playlist[currentIndex], index: currentIndex };
    
    case 'random':
      const randomIndex = Math.floor(Math.random() * playlist.length);
      return { track: playlist[randomIndex], index: randomIndex };
    
    case 'order':
    default:
      const nextIndex = (currentIndex + 1) % playlist.length;
      return { track: playlist[nextIndex], index: nextIndex };
  }
}

/**
 * Get previous track
 */
export function getPreviousTrack(
  playlist: MusicTrack[], 
  currentIndex: number
): { track: MusicTrack | null; index: number } {
  if (playlist.length === 0) {
    return { track: null, index: -1 };
  }
  
  const prevIndex = currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1;
  return { track: playlist[prevIndex], index: prevIndex };
}

/**
 * Format duration in seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
