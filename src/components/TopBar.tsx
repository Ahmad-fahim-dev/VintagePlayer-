import { motion } from 'motion/react';
import { useMusic } from '../context/MusicContext';

export default function TopBar() {
  const { isDarkMode, toggleDarkMode } = useMusic();

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-background/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 w-full fixed top-0 z-50 border-b border-outline-variant/20"
    >
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
          className="w-8 h-8 rounded-full bg-on-surface vinyl-grooves flex items-center justify-center flex-shrink-0"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
        </motion.div>
        <h1 className="text-xl font-headline italic tracking-tighter text-on-surface">VintageMusic</h1>
        <span className="text-[8px] font-label uppercase tracking-[0.2em] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
          PRO
        </span>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.85, rotate: 20 }}
          whileHover={{ scale: 1.1 }}
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl hover:bg-surface-container-highest transition-colors"
        >
          <motion.span
            key={isDarkMode ? 'dark' : 'light'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="material-symbols-outlined text-primary text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {isDarkMode ? 'dark_mode' : 'light_mode'}
          </motion.span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="p-2.5 rounded-xl hover:bg-surface-container-highest transition-colors"
        >
          <span className="material-symbols-outlined text-primary text-xl">account_circle</span>
        </motion.button>
      </div>
    </motion.header>
  );
}
