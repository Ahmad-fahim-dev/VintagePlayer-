import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRACKS } from '../data';

interface MusicContextType {
  tracks: typeof TRACKS;
  currentTrack: any;
  isPlaying: boolean;
  favorites: string[];
  playTrack: (track: any) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleFavorite: (id: string) => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  repeat: boolean;
  toggleRepeat: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('favorites').then(saved => {
      if (saved) setFavorites(JSON.parse(saved));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
    const nextIdx = shuffle ? Math.floor(Math.random() * TRACKS.length) : (idx + 1) % TRACKS.length;
    setCurrentTrack(TRACKS[nextIdx]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
    const prevIdx = (idx - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrack(TRACKS[prevIdx]);
    setIsPlaying(true);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  return (
    <MusicContext.Provider value={{
      tracks: TRACKS, currentTrack, isPlaying, favorites,
      playTrack, togglePlay, nextTrack, prevTrack, toggleFavorite,
      shuffle, toggleShuffle: () => setShuffle(!shuffle),
      repeat, toggleRepeat: () => setRepeat(!repeat)
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
};
