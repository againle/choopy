// Letter management utility
// This file provides functions to manage letters in the public/letters directory

export interface Letter {
  id: string;
  time: string;
  title: string;
  content: string;
  state: 'read' | 'not read';
}

/**
 * Load all letters from the public/letters directory
 * This function reads the index.json file and then loads each individual letter
 */
export async function loadAllLetters(): Promise<Letter[]> {
  try {
    // Try different possible paths for the index file
    const possibleIndexPaths = [
      '/choopy/letters/index.json',  // With basePath
      '/letters/index.json',         // Without basePath
      './letters/index.json',        // Relative path
    ];
    
    let letterFiles: string[] = [];
    let indexFound = false;
    
    for (const path of possibleIndexPaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const indexData = await response.json();
          letterFiles = indexData.letters || [];
          indexFound = true;
          break;
        }
      } catch {
        continue;
      }
    }
    
    if (!indexFound) {
      throw new Error('Failed to load letters index file');
    }
    
    // Load each individual letter file
    const loadedLetters: Letter[] = [];
    const possibleBasePaths = [
      '/choopy/letters/',  // With basePath
      '/letters/',         // Without basePath
      './letters/',        // Relative path
    ];
    
    for (const fileName of letterFiles) {
      let letterLoaded = false;
      
      for (const basePath of possibleBasePaths) {
        try {
          const response = await fetch(basePath + fileName);
          if (response.ok) {
            const letterData = await response.json();
            loadedLetters.push(letterData);
            letterLoaded = true;
            break;
          }
        } catch {
          continue;
        }
      }
      
      if (!letterLoaded) {
        console.warn(`Failed to load letter: ${fileName}`);
      }
    }
    
    // Sort letters by time (newest first)
    loadedLetters.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    
    return loadedLetters;
  } catch (error) {
    console.error('Error loading letters:', error);
    throw error;
  }
}

/**
 * Get the count of unread letters
 */
export function getUnreadCount(letters: Letter[]): number {
  return letters.filter(letter => letter.state === 'not read').length;
}

/**
 * Mark a letter as read
 */
export function markLetterAsRead(letters: Letter[], letterId: string): Letter[] {
  return letters.map(letter => 
    letter.id === letterId 
      ? { ...letter, state: 'read' as const }
      : letter
  );
}

/**
 * Get the first unread letter
 */
export function getFirstUnreadLetter(letters: Letter[]): Letter | null {
  return letters.find(letter => letter.state === 'not read') || null;
}

/**
 * Template for creating a new letter JSON file
 * Use this as a guide when creating new letter files
 */
export function createLetterTemplate(id: string, title: string, content: string): Letter {
  return {
    id,
    time: new Date().toISOString(),
    title,
    content,
    state: 'not read'
  };
}
