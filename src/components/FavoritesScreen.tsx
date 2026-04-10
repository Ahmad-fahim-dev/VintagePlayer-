import { motion } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import { formatTime, Track } from '../data';

interface FavoritesScreenProps {
  onNavigateToPlayer: () => void;
}

export default function FavoritesScreen({ onNavigateToPlayer }: FavoritesScreenProps) {
  const { tracks, favorites, playTrack, toggleFavorite, currentTrack, isPlaying } = useMusic();

  const favoriteTracks = tracks.filter(t => favorites.includes(t.id));

  const handlePlay = (track: Track) => {
    playTrack(track);
    onNavigateToPlayer();
  };

  const totalDuration = favoriteTracks.reduce((sum, t) => sum + t.duration, 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-end gap-4 mb-2">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary tracking-tighter">Favorites</h2>
          {favoriteTracks.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mb-1"
            >
              <span className="text-primary text-xs font-bold">{favoriteTracks.length}</span>
            </motion.div>
          )}
        </div>
        <p className="font-body text-sm text-on-surface-variant/60">
          {favoriteTracks.length > 0
            ? `${favoriteTracks.length} cherished tracks • ${formatTime(totalDuration)} total`
            : 'Your cherished analog collection.'
          }
        </p>
      </motion.section>

      {/* Favorite Tracks */}
      <section>
        <div className="space-y-1">
          {favoriteTracks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-on-surface-variant/40"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="material-symbols-outlined text-6xl mb-4 block">heart_broken</span>
              </motion.div>
              <p className="italic text-base mb-1">No favorites yet</p>
              <p className="text-xs text-on-surface-variant/30">Tap the heart icon on any track to add it here</p>
            </motion.div>
          ) : (
            favoriteTracks.map((track, i) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ x: 4 }}
                  onClick={() => handlePlay(track)}
                  className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 ${isCurrent ? 'bg-primary/8 border border-primary/20' : 'hover:bg-surface-container-highest/60'
                    }`}
                >
                  {/* Album Art */}
                  <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden relative shadow-sm">
                    <img src={track.image} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="material-symbols-outlined text-on-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    </div>
                    {isCurrent && isPlaying && (
                      <motion.div
                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-primary/20"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <h3 className={`font-headline text-base font-medium truncate ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                      {track.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="font-label text-[11px] text-on-surface-variant truncate">{track.artist}</p>
                      <span className="text-[8px] text-on-surface-variant/30">•</span>
                      <span className="text-[10px] font-label text-on-surface-variant/50">{formatTime(track.duration)}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="hidden md:block flex-shrink-0 text-right">
                    <p className="font-label text-[8px] uppercase font-bold text-on-surface-variant/40 tracking-wider">Format</p>
                    <p className="font-label text-[10px] font-semibold text-on-surface-variant/60">{track.format}</p>
                  </div>

                  {/* Genre Tag */}
                  <span className="text-[9px] font-label text-tertiary/60 bg-tertiary/8 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold hidden sm:block flex-shrink-0">
                    {track.genre}
                  </span>

                  {/* Unfavorite Button */}
                  <motion.button
                    whileTap={{ scale: 0.7 }}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                    className="text-primary hover:scale-110 transition-transform p-1.5 flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                  </motion.button>
                </motion.div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
