import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { TRACKS, Track, formatTime } from '../data';

interface MusicContextType {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  volume: number;
  favorites: string[];
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (v: number) => void;
  toggleFavorite: (id: string) => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  repeat: 'off' | 'all' | 'one';
  toggleRepeat: () => void;
  progress: number;
  duration: number;
  seek: (time: number) => void;
  isBuffering: boolean;
  queue: Track[];
  addToQueue: (track: Track) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  recentlyPlayed: Track[];
  analyserNode: AnalyserNode | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;
  playCount: Record<string, number>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(80);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [playCount, setPlayCount] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('playCount');
    return saved ? JSON.parse(saved) : {};
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Persist play counts
  useEffect(() => {
    localStorage.setItem('playCount', JSON.stringify(playCount));
  }, [playCount]);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = 'anonymous';
      audioRef.current.preload = 'auto';
    }

    const audio = audioRef.current;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };
    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);
    const onPlaying = () => setIsBuffering(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('playing', onPlaying);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('playing', onPlaying);
    };
  }, [repeat]);

  // Setup Web Audio API analyser
  const setupAnalyser = useCallback(() => {
    if (!audioRef.current || audioCtxRef.current) return;
    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      const source = ctx.createMediaElementSource(audioRef.current);
      const gain = ctx.createGain();
      source.connect(analyser);
      analyser.connect(gain);
      gain.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
      gainRef.current = gain;
      gain.gain.value = volume / 100;
    } catch (e) {
      console.warn('Web Audio API setup failed:', e);
    }
  }, []);

  // Volume control
  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
    if (gainRef.current) gainRef.current.gain.value = v / 100;
  }, []);

  const playTrack = useCallback((track: Track) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    // Add to recently played
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      return [track, ...filtered].slice(0, 20);
    });

    // Increment play count
    setPlayCount(prev => ({
      ...prev,
      [track.id]: (prev[track.id] || 0) + 1
    }));

    setCurrentTrack(track);
    audio.src = track.audioUrl;
    audio.volume = volume / 100;

    setupAnalyser();

    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(e => {
      console.warn('Playback failed:', e);
      setIsPlaying(false);
    });
  }, [volume, setupAnalyser]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    setupAnalyser();
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    if (!audio.src || audio.src === '') {
      // First play — load current track
      audio.src = currentTrack.audioUrl;
      audio.volume = volume / 100;
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [isPlaying, currentTrack, volume, setupAnalyser]);

  const handleNext = useCallback(() => {
    // Check queue first
    if (queue.length > 0) {
      const next = queue[0];
      setQueue(prev => prev.slice(1));
      playTrack(next);
      return;
    }

    const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
    let nextIdx: number;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * TRACKS.length);
      while (nextIdx === idx && TRACKS.length > 1) {
        nextIdx = Math.floor(Math.random() * TRACKS.length);
      }
    } else {
      nextIdx = (idx + 1) % TRACKS.length;
    }
    playTrack(TRACKS[nextIdx]);
  }, [currentTrack, shuffle, queue, playTrack]);

  const prevTrack = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
    const prevIdx = (idx - 1 + TRACKS.length) % TRACKS.length;
    playTrack(TRACKS[prevIdx]);
  }, [currentTrack, playTrack]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearQueue = useCallback(() => setQueue([]), []);

  const toggleRepeat = useCallback(() => {
    setRepeat(prev => prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off');
  }, []);

  return (
    <MusicContext.Provider value={{
      tracks: TRACKS, currentTrack, isPlaying, volume, favorites,
      playTrack, togglePlay, nextTrack: handleNext, prevTrack, setVolume, toggleFavorite,
      shuffle, toggleShuffle: () => setShuffle(!shuffle),
      repeat, toggleRepeat,
      progress, duration, seek, isBuffering,
      queue, addToQueue, removeFromQueue, clearQueue,
      recentlyPlayed,
      analyserNode: analyserRef.current,
      isDarkMode, toggleDarkMode: () => setIsDarkMode((p: boolean) => !p),
      isLoading,
      playCount,
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
