import { motion } from 'motion/react';
import { useMusic } from '../context/MusicContext';

interface BottomNavProps {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
}

const navItems = [
  { id: 'library', icon: 'library_music', label: 'Library' },
  { id: 'player', icon: 'play_circle', label: 'Now Playing' },
  { id: 'favorites', icon: 'favorite', label: 'Favorites' },
  { id: 'discover', icon: 'explore', label: 'Discover' },
];

export default function BottomNav({ currentScreen, setCurrentScreen }: BottomNavProps) {
  const { isPlaying, currentTrack } = useMusic();

  return (
    <motion.nav
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, type: "spring", bounce: 0.2 }}
      className="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 px-2 bg-background/85 backdrop-blur-xl shadow-[0px_-8px_30px_rgba(0,0,0,0.1)] border-t border-outline-variant/10"
    >
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.85 }}
            onClick={() => setCurrentScreen(item.id)}
            className={`relative flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-2xl transition-all duration-300 ${isActive
                ? 'text-primary'
                : 'text-on-surface-variant/60 hover:text-on-surface-variant'
              }`}
          >
            {/* Active indicator pill */}
            {isActive && (
              <motion.div
                layoutId="navIndicator"
                className="absolute -top-1 w-8 h-1 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}

            {/* Pulsing dot for Now Playing */}
            {item.id === 'player' && isPlaying && !isActive && (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-1.5 right-3 w-2 h-2 bg-primary rounded-full"
              />
            )}

            <motion.span
              animate={{ scale: isActive ? 1.15 : 1 }}
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </motion.span>
            <span className="font-label text-[9px] tracking-wider uppercase font-bold">
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}
