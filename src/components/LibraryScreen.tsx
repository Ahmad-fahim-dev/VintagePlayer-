import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import { formatTime, Track } from '../data';

interface LibraryScreenProps {
  onNavigateToPlayer: () => void;
}

function TrackSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3">
      <div className="w-14 h-14 skeleton rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="w-3/4 h-4 skeleton" />
        <div className="w-1/2 h-3 skeleton" />
      </div>
    </div>
  );
}

function TrackItem({ track, index, onPlay, isFavorite, onToggleFav, isCurrentTrack, isPlaying, playCount, onAddToQueue }: {
  track: Track; index: number; onPlay: () => void;
  isFavorite: boolean; onToggleFav: () => void;
  isCurrentTrack: boolean; isPlaying: boolean;
  playCount: number; onAddToQueue: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ x: 4 }}
      className={`group flex items-center gap-4 p-3 rounded-xl transition-all duration-200 cursor-pointer relative ${isCurrentTrack
          ? 'bg-primary/8 border border-primary/20'
          : 'hover:bg-surface-container-highest/60'
        }`}
      onClick={onPlay}
    >
      {/* Track Number / Playing Indicator */}
      <div className="w-6 text-center flex-shrink-0">
        {isCurrentTrack && isPlaying ? (
          <div className="flex items-end justify-center gap-[2px] h-4">
            {[0.4, 0.8, 0.5, 0.9].map((h, i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [0.2, h, 0.2] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                className="w-[3px] h-full bg-primary rounded-full origin-bottom"
              />
            ))}
          </div>
        ) : (
          <span className="text-xs text-on-surface-variant/40 font-label font-bold group-hover:hidden">
            {index + 1}
          </span>
        )}
        <span className="material-symbols-outlined text-primary text-lg hidden group-hover:inline-block" style={{ fontVariationSettings: "'FILL' 1" }}>
          play_arrow
        </span>
      </div>

      {/* Album Art */}
      <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden relative shadow-sm">
        <img
          src={track.image}
          alt={track.title}
          className={`w-full h-full object-cover transition-all duration-500 ${isCurrentTrack ? '' : 'grayscale-[40%] group-hover:grayscale-0'}`}
          loading="lazy"
        />
        {isCurrentTrack && isPlaying && (
          <motion.div
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary/20"
          />
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-headline text-base font-medium truncate ${isCurrentTrack ? 'text-primary' : 'text-on-surface'}`}>
          {track.title}
        </h3>
        <div className="flex items-center gap-2">
          <p className="font-label text-[11px] text-on-surface-variant truncate">{track.artist}</p>
          <span className="text-[8px] font-label text-on-surface-variant/40">•</span>
          <span className="text-[10px] font-label text-on-surface-variant/50">{formatTime(track.duration)}</span>
        </div>
      </div>

      {/* Right side — Format + Actions */}
      <div className="hidden md:flex items-center gap-4 flex-shrink-0">
        <div className="text-right">
          <p className="font-label text-[8px] uppercase font-bold text-on-surface-variant/40 tracking-wider">Format</p>
          <p className="font-label text-[10px] font-semibold text-on-surface-variant/70">{track.format}</p>
        </div>
        <span className="text-[9px] font-label text-tertiary/60 bg-tertiary/8 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
          {track.genre}
        </span>
      </div>

      {/* Play count badge */}
      {playCount > 0 && (
        <span className="text-[9px] text-on-surface-variant/40 font-label hidden sm:block">
          {playCount}×
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <motion.button
          whileTap={{ scale: 0.7 }}
          onClick={onToggleFav}
          className="text-on-surface-variant hover:text-primary transition-colors p-1.5"
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
            favorite
          </span>
        </motion.button>
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.7 }}
            onClick={() => setShowMenu(!showMenu)}
            className="text-on-surface-variant/40 hover:text-on-surface-variant transition-colors p-1.5"
          >
            <span className="material-symbols-outlined text-lg">more_vert</span>
          </motion.button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                className="absolute right-0 top-full mt-1 bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-xl z-20 py-1.5 min-w-[140px]"
                onClick={() => setShowMenu(false)}
              >
                <button
                  onClick={onAddToQueue}
                  className="w-full px-4 py-2 text-left text-sm font-body hover:bg-surface-container-highest transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">queue_music</span>
                  Add to Queue
                </button>
                <button className="w-full px-4 py-2 text-left text-sm font-body hover:bg-surface-container-highest transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">share</span>
                  Share
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function LibraryScreen({ onNavigateToPlayer }: LibraryScreenProps) {
  const { tracks, favorites, playTrack, toggleFavorite, currentTrack, isPlaying, isLoading, playCount, addToQueue, recentlyPlayed } = useMusic();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const genres = ['all', ...Array.from(new Set(tracks.map(t => t.genre)))];

  const filteredTracks = tracks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || t.genre === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handlePlay = (track: Track) => {
    playTrack(track);
    onNavigateToPlayer();
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-1 tracking-tighter">Your Library</h2>
        <p className="text-sm text-on-surface-variant/60 font-body">{tracks.length} tracks • Curated collection</p>
      </motion.section>

      {/* Search */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-xl">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or artist..."
            className="w-full bg-surface-container-low/50 border border-outline-variant/10 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/30 focus:border-primary/20 text-on-surface font-body text-sm outline-none transition-all"
          />
          {searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface-variant p-1"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </motion.button>
          )}
        </div>
      </motion.section>

      {/* Genre Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
      >
        {genres.map(genre => (
          <motion.button
            key={genre}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveFilter(genre)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-label uppercase tracking-wider font-bold whitespace-nowrap transition-all ${activeFilter === genre
                ? 'bg-primary text-on-primary shadow-md'
                : 'bg-surface-container-low text-on-surface-variant/60 hover:bg-surface-container-highest'
              }`}
          >
            {genre}
          </motion.button>
        ))}
      </motion.div>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && !searchQuery && activeFilter === 'all' && (
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="font-headline text-lg font-bold text-on-surface mb-3">Recently Played</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {recentlyPlayed.slice(0, 6).map((track, i) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePlay(track)}
                className="flex-shrink-0 w-28 cursor-pointer group"
              >
                <div className="w-28 h-28 rounded-xl overflow-hidden shadow-md mb-2 relative">
                  <img src={track.image} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                    <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </div>
                </div>
                <p className="text-xs font-medium truncate text-on-surface">{track.title}</p>
                <p className="text-[10px] text-on-surface-variant/50 truncate">{track.artist}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Track List */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-headline text-lg font-bold text-on-surface">
            {activeFilter === 'all' ? 'All Tracks' : activeFilter}
          </h3>
          <span className="text-[10px] font-label text-on-surface-variant/40 uppercase tracking-wider">
            {filteredTracks.length} result{filteredTracks.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-1">
          {isLoading ? (
            [...Array(5)].map((_, i) => <TrackSkeleton key={i} />)
          ) : filteredTracks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-on-surface-variant/40"
            >
              <span className="material-symbols-outlined text-5xl mb-3">search_off</span>
              <p className="italic text-sm">No tracks found</p>
            </motion.div>
          ) : (
            filteredTracks.map((track, i) => (
              <TrackItem
                key={track.id}
                track={track}
                index={i}
                onPlay={() => handlePlay(track)}
                isFavorite={favorites.includes(track.id)}
                onToggleFav={() => toggleFavorite(track.id)}
                isCurrentTrack={currentTrack?.id === track.id}
                isPlaying={isPlaying}
                playCount={playCount[track.id] || 0}
                onAddToQueue={() => addToQueue(track)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
