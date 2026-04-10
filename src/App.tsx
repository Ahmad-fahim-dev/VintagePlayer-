import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import LibraryScreen from './components/LibraryScreen';
import PlayerScreen from './components/PlayerScreen';
import FavoritesScreen from './components/FavoritesScreen';
import DiscoverScreen from './components/DiscoverScreen';
import SplashScreen from './components/SplashScreen';
import { MusicProvider, useMusic } from './context/MusicContext';

function MiniPlayer({ onOpen }: { onOpen: () => void }) {
  const { currentTrack, isPlaying, togglePlay, progress, duration } = useMusic();

  if (!currentTrack) return null;
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-20 left-3 right-3 z-40 bg-surface-container-low/95 backdrop-blur-xl rounded-2xl shadow-xl border border-outline-variant/10 overflow-hidden cursor-pointer"
      onClick={onOpen}
    >
      {/* Progress line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-surface-container-highest">
        <div className="h-full bg-primary transition-all duration-200" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="flex items-center gap-3 p-2.5 pl-3">
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-md"
        >
          <img src={currentTrack.image} alt="" className="w-full h-full object-cover" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-headline font-medium truncate text-on-surface">{currentTrack.title}</p>
          <p className="text-[10px] font-label text-on-surface-variant/60 truncate">{currentTrack.artist}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.75 }}
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-md flex-shrink-0"
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState('library');
  const { isLoading } = useMusic();

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-tertiary/30 pb-24 overflow-x-hidden">
      {/* Splash Screen */}
      {isLoading && <SplashScreen />}

      <TopBar />
      <main className="pt-20 px-4 md:px-6 max-w-5xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {currentScreen === 'library' && (
              <LibraryScreen onNavigateToPlayer={() => setCurrentScreen('player')} />
            )}
            {currentScreen === 'player' && (
              <PlayerScreen onBack={() => setCurrentScreen('library')} />
            )}
            {currentScreen === 'favorites' && (
              <FavoritesScreen onNavigateToPlayer={() => setCurrentScreen('player')} />
            )}
            {currentScreen === 'discover' && (
              <DiscoverScreen onNavigateToPlayer={() => setCurrentScreen('player')} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mini Player — show when not on player screen */}
      {currentScreen !== 'player' && (
        <MiniPlayer onOpen={() => setCurrentScreen('player')} />
      )}

      <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
    </div>
  );
}

export default function App() {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
}
