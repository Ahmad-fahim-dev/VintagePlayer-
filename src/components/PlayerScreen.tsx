import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import { formatTime } from '../data';

interface PlayerScreenProps {
  onBack: () => void;
}

function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { analyserNode, isPlaying, isDarkMode } = useMusic();
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserNode) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserNode.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 32;
      const barWidth = canvas.width / barCount - 2;
      const centerY = canvas.height;

      for (let i = 0; i < barCount; i++) {
        const dataIdx = Math.floor(i * bufferLength / barCount);
        const value = dataArray[dataIdx] / 255;
        const barHeight = value * canvas.height * 0.9 + 2;

        const hue = isDarkMode ? (0 + i * 3) : (350 + i * 2);
        const sat = isDarkMode ? '80%' : '60%';
        const light = isDarkMode ? '55%' : '35%';

        ctx.fillStyle = `hsla(${hue}, ${sat}, ${light}, ${0.4 + value * 0.6})`;
        ctx.beginPath();
        const x = i * (barWidth + 2);
        ctx.roundRect(x, centerY - barHeight, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      draw();
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [analyserNode, isPlaying, isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={60}
      className="w-full h-[60px] opacity-80"
    />
  );
}

function MiniWaveform({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-4">
      {[0.3, 0.7, 0.5, 1, 0.6, 0.8, 0.4].map((h, i) => (
        <motion.div
          key={i}
          animate={isActive ? {
            scaleY: [0.3, h, 0.3],
          } : { scaleY: 0.3 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.08,
            ease: "easeInOut",
          }}
          className="w-[3px] bg-primary rounded-full origin-bottom"
          style={{ height: '100%' }}
        />
      ))}
    </div>
  );
}

export default function PlayerScreen({ onBack }: PlayerScreenProps) {
  const {
    currentTrack, isPlaying, togglePlay, nextTrack, prevTrack,
    volume, setVolume, favorites, toggleFavorite,
    shuffle, toggleShuffle, repeat, toggleRepeat,
    progress, duration, seek, isBuffering, queue
  } = useMusic();

  const [showQueue, setShowQueue] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    seek(ratio * duration);
  }, [duration, seek]);

  if (!currentTrack) return null;

  const isFavorite = favorites.includes(currentTrack.id);
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center max-w-lg mx-auto space-y-6 pt-2 pb-4"
    >
      {/* Header */}
      <div className="w-full flex justify-between items-center px-1">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onBack}
          className="p-3 hover:bg-surface-container-highest rounded-2xl transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant">keyboard_arrow_down</span>
        </motion.button>
        <div className="flex flex-col items-center">
          <span className="font-label text-[9px] font-bold uppercase tracking-[0.25em] text-tertiary">Now Playing</span>
          <span className="font-label text-[8px] text-on-surface-variant/50 uppercase tracking-wider">{currentTrack.format}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setShowQueue(!showQueue)}
          className={`p-3 rounded-2xl transition-colors ${showQueue ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-highest'}`}
        >
          <span className="material-symbols-outlined text-on-surface-variant">queue_music</span>
        </motion.button>
      </div>

      {/* Vinyl Player */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        className="relative w-full max-w-[280px] aspect-square flex items-center justify-center"
      >
        {/* Glow behind vinyl */}
        <motion.div
          animate={{
            opacity: isPlaying ? [0.3, 0.6, 0.3] : 0.1,
            scale: isPlaying ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[-20px] rounded-full bg-primary/20 blur-3xl"
        />

        <div className="absolute inset-0 bg-surface-container-low rounded-full shadow-[20px_20px_60px_rgba(88,65,65,0.08)]"></div>
        <div
          className={`relative w-full h-full rounded-full bg-on-surface vinyl-grooves shadow-2xl flex items-center justify-center p-3 animate-spin-slow ${isBuffering ? 'animate-pulse-glow' : ''}`}
          style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
        >
          <div className="w-full h-full rounded-full overflow-hidden border-[6px] border-on-surface/80 relative">
            <img src={currentTrack.image} alt={currentTrack.title} className="w-full h-full object-cover opacity-90" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-surface rounded-full shadow-inner border-2 border-outline-variant/30"></div>
          </div>
        </div>

        {/* Buffering indicator */}
        <AnimatePresence>
          {isBuffering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-on-surface/30 rounded-full z-10"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <span className="material-symbols-outlined text-4xl text-on-primary">sync</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Audio Visualizer */}
      <div className="w-full px-4">
        <AudioVisualizer />
      </div>

      {/* Track Info */}
      <motion.div
        key={currentTrack.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center w-full px-4"
      >
        <div className="flex items-center justify-center gap-3 mb-1">
          <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight leading-none italic truncate max-w-[250px]">
            {currentTrack.title}
          </h2>
          <motion.button
            whileTap={{ scale: 0.7 }}
            animate={isFavorite ? { scale: [1, 1.3, 1] } : {}}
            onClick={() => toggleFavorite(currentTrack.id)}
            className="text-primary flex-shrink-0 p-1"
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
              favorite
            </span>
          </motion.button>
        </div>
        <p className="font-body text-sm text-on-surface-variant font-medium truncate">{currentTrack.artist}</p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="text-[9px] font-label uppercase tracking-wider text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full font-bold">
            {currentTrack.genre}
          </span>
          {currentTrack.bpm && (
            <span className="text-[9px] font-label text-on-surface-variant/60">{currentTrack.bpm} BPM</span>
          )}
          <MiniWaveform isActive={isPlaying} />
        </div>
      </motion.div>

      {/* Enhanced Progress Bar */}
      <div className="w-full space-y-1.5 px-6">
        <div
          ref={progressBarRef}
          onClick={handleSeek}
          className="relative w-full h-2 bg-surface-container-highest rounded-full cursor-pointer group overflow-hidden"
        >
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progressPercent}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between font-label text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold tabular-nums">
          <span>{formatTime(progress)}</span>
          <span>{duration > 0 ? formatTime(duration) : formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4 w-full px-4">
        <motion.button
          whileTap={{ scale: 0.75 }}
          onClick={toggleShuffle}
          className={`transition-all p-2.5 rounded-xl ${shuffle ? 'text-primary bg-primary/10' : 'text-on-surface-variant/60 hover:text-primary hover:bg-surface-container-highest'}`}
        >
          <span className="material-symbols-outlined text-xl">shuffle</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.75 }}
          whileHover={{ scale: 1.1 }}
          onClick={prevTrack}
          className="text-on-surface hover:text-primary transition-colors p-2"
        >
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>skip_previous</span>
        </motion.button>

        {/* Play/Pause Button — Large Rounded */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.05 }}
          animate={{
            scale: isPlaying ? 1 : 1,
            boxShadow: isPlaying
              ? '0 8px 30px rgba(139,0,0,0.4)'
              : '0 4px 15px rgba(139,0,0,0.2)'
          }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={togglePlay}
          className="w-[72px] h-[72px] bg-gradient-to-br from-primary via-primary to-primary-container rounded-full shadow-xl flex items-center justify-center text-on-primary glow-primary"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isPlaying ? 'pause' : 'play'}
              initial={{ opacity: 0, scale: 0.3, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.3, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="material-symbols-outlined text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlaying ? 'pause' : 'play_arrow'}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.75 }}
          whileHover={{ scale: 1.1 }}
          onClick={nextTrack}
          className="text-on-surface hover:text-primary transition-colors p-2"
        >
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>skip_next</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.75 }}
          onClick={toggleRepeat}
          className={`transition-all p-2.5 rounded-xl relative ${repeat !== 'off' ? 'text-primary bg-primary/10' : 'text-on-surface-variant/60 hover:text-primary hover:bg-surface-container-highest'}`}
        >
          <span className="material-symbols-outlined text-xl">{repeat === 'one' ? 'repeat_one' : 'repeat'}</span>
        </motion.button>
      </div>

      {/* Volume Control */}
      <div className="w-full flex items-center gap-3 px-8">
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => setVolume(volume > 0 ? 0 : 80)}>
          <span className="material-symbols-outlined text-on-surface-variant text-lg">
            {volume === 0 ? 'volume_off' : volume < 50 ? 'volume_down' : 'volume_up'}
          </span>
        </motion.button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 h-1.5 bg-surface-container-highest rounded-full volume-slider"
          style={{
            background: `linear-gradient(to right, var(--color-primary) ${volume}%, var(--color-surface-container-highest) ${volume}%)`
          }}
        />
        <span className="font-label text-[10px] text-on-surface-variant/50 w-7 text-right tabular-nums">{volume}</span>
      </div>

      {/* Queue Panel */}
      <AnimatePresence>
        {showQueue && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full bg-surface-container-low rounded-2xl overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-headline text-lg font-bold text-on-surface">Queue</h3>
                <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider">
                  {queue.length} track{queue.length !== 1 ? 's' : ''}
                </span>
              </div>
              {queue.length === 0 ? (
                <p className="text-center text-on-surface-variant/50 text-sm italic py-4">Queue is empty</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                  {queue.map((track, i) => (
                    <div key={track.id + i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-highest transition-colors">
                      <img src={track.image} alt="" className="w-8 h-8 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{track.title}</p>
                        <p className="text-[10px] text-on-surface-variant truncate">{track.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
