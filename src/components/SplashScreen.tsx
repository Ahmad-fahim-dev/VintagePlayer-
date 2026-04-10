import { motion } from 'motion/react';

export default function SplashScreen() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 2.0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
            style={{ pointerEvents: 'none' }}
        >
            {/* Animated background circles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 2, 3], opacity: [0, 0.1, 0] }}
                        transition={{ duration: 2, delay: i * 0.2, ease: "easeOut" }}
                        className="absolute rounded-full border border-primary/30"
                        style={{
                            width: 100,
                            height: 100,
                            left: '50%',
                            top: '50%',
                            marginLeft: -50,
                            marginTop: -50,
                        }}
                    />
                ))}
            </div>

            {/* Logo */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.5 }}
                className="relative z-10 flex flex-col items-center"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 rounded-full bg-on-surface vinyl-grooves shadow-2xl flex items-center justify-center mb-6"
                >
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl font-headline italic tracking-tighter text-on-surface mb-2"
                >
                    VintageMusic
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-xs font-label uppercase tracking-[0.3em] text-on-surface-variant"
                >
                    Hi-Fi Audio Experience
                </motion.p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-20 w-48 h-1 bg-surface-container-highest rounded-full overflow-hidden"
            >
                <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.8, delay: 0.3, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full"
                />
            </motion.div>
        </motion.div>
    );
}
