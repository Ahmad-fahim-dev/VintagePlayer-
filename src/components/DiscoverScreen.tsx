import { useState } from 'react';
import { motion } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import { Track } from '../data';

interface DiscoverScreenProps {
    onNavigateToPlayer: () => void;
}

export default function DiscoverScreen({ onNavigateToPlayer }: DiscoverScreenProps) {
    const { tracks, playTrack, favorites, toggleFavorite, playCount, addToQueue } = useMusic();
    const [showQR, setShowQR] = useState(false);

    // Sort tracks by play count for "Top Played"
    const topPlayed = [...tracks].sort((a, b) => (playCount[b.id] || 0) - (playCount[a.id] || 0)).slice(0, 5);

    // Genres breakdown
    const genreMap = new Map<string, Track[]>();
    tracks.forEach(t => {
        const arr = genreMap.get(t.genre) || [];
        arr.push(t);
        genreMap.set(t.genre, arr);
    });

    const handlePlay = (track: Track) => {
        playTrack(track);
        onNavigateToPlayer();
    };

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-1 tracking-tighter">Discover</h2>
                <p className="text-sm text-on-surface-variant/60 font-body">Explore your music in new ways</p>
            </motion.section>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="grid grid-cols-3 gap-3"
            >
                {[
                    { icon: 'library_music', label: 'Tracks', value: tracks.length, color: 'primary' },
                    { icon: 'favorite', label: 'Favorites', value: favorites.length, color: 'primary' },
                    { icon: 'genre', label: 'Genres', value: genreMap.size, color: 'tertiary' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        whileHover={{ y: -3, scale: 1.02 }}
                        className="bg-surface-container-low rounded-2xl p-4 text-center border border-outline-variant/10"
                    >
                        <span className={`material-symbols-outlined text-${stat.color} text-2xl mb-1 block`} style={{ fontVariationSettings: "'FILL' 1" }}>
                            {stat.icon}
                        </span>
                        <p className="text-2xl font-headline font-bold text-on-surface">{stat.value}</p>
                        <p className="text-[9px] font-label uppercase tracking-wider text-on-surface-variant/50 font-bold">{stat.label}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Top Played */}
            {topPlayed.some(t => (playCount[t.id] || 0) > 0) && (
                <motion.section
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <h3 className="font-headline text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-tertiary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                        Most Played
                    </h3>
                    <div className="space-y-1">
                        {topPlayed.filter(t => (playCount[t.id] || 0) > 0).map((track, i) => (
                            <motion.div
                                key={track.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.05 }}
                                whileHover={{ x: 4 }}
                                onClick={() => handlePlay(track)}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-highest/60 cursor-pointer transition-all group"
                            >
                                <span className="w-6 text-center text-sm font-headline font-bold text-primary/40">#{i + 1}</span>
                                <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                    <img src={track.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate text-on-surface">{track.title}</p>
                                    <p className="text-[10px] text-on-surface-variant/50">{track.artist}</p>
                                </div>
                                <span className="text-xs text-primary font-label font-bold">{playCount[track.id]}×</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* Browse by Genre */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="font-headline text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-xl">category</span>
                    Browse by Genre
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {Array.from(genreMap.entries()).map(([genre, genreTracks], i) => (
                        <motion.div
                            key={genre}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.35 + i * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10 cursor-pointer group"
                        >
                            <div className="relative h-24 overflow-hidden">
                                <img src={genreTracks[0].image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <div className="absolute bottom-2 left-3">
                                    <p className="text-white font-headline font-bold text-lg">{genre}</p>
                                    <p className="text-white/60 text-[10px] font-label">{genreTracks.length} track{genreTracks.length > 1 ? 's' : ''}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Expo QR Code Section */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h3 className="font-headline text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-xl">qr_code_2</span>
                    Mobile App
                </h3>
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 text-center"
                >
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowQR(!showQR)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-2xl font-label font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all mb-4"
                    >
                        <span className="material-symbols-outlined text-lg">phone_iphone</span>
                        {showQR ? 'Hide QR Code' : 'Show Expo QR Code'}
                    </motion.button>

                    {showQR && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, height: 0 }}
                            animate={{ opacity: 1, scale: 1, height: 'auto' }}
                            exit={{ opacity: 0, scale: 0.9, height: 0 }}
                            className="mt-4"
                        >
                            {/* QR Code SVG */}
                            <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto mb-4">
                                <svg viewBox="0 0 200 200" width="180" height="180" className="mx-auto">
                                    {/* QR code pattern */}
                                    <rect width="200" height="200" fill="white" />
                                    {/* Position patterns */}
                                    <rect x="10" y="10" width="50" height="50" fill="black" rx="4" />
                                    <rect x="15" y="15" width="40" height="40" fill="white" rx="2" />
                                    <rect x="22" y="22" width="26" height="26" fill="black" rx="2" />

                                    <rect x="140" y="10" width="50" height="50" fill="black" rx="4" />
                                    <rect x="145" y="15" width="40" height="40" fill="white" rx="2" />
                                    <rect x="152" y="22" width="26" height="26" fill="black" rx="2" />

                                    <rect x="10" y="140" width="50" height="50" fill="black" rx="4" />
                                    <rect x="15" y="145" width="40" height="40" fill="white" rx="2" />
                                    <rect x="22" y="152" width="26" height="26" fill="black" rx="2" />

                                    {/* Data pattern */}
                                    {[
                                        [70, 10], [80, 10], [90, 10], [100, 10], [120, 10],
                                        [70, 20], [100, 20], [110, 20], [130, 20],
                                        [80, 30], [90, 30], [110, 30], [120, 30],
                                        [70, 40], [100, 40], [130, 40],
                                        [80, 50], [90, 50], [110, 50], [120, 50],
                                        [10, 70], [20, 70], [40, 70], [50, 70], [70, 70], [90, 70], [100, 70], [120, 70], [140, 70], [160, 70], [180, 70],
                                        [30, 80], [50, 80], [70, 80], [100, 80], [130, 80], [150, 80], [170, 80],
                                        [10, 90], [40, 90], [60, 90], [80, 90], [110, 90], [130, 90], [160, 90], [180, 90],
                                        [20, 100], [50, 100], [70, 100], [90, 100], [120, 100], [140, 100], [170, 100],
                                        [10, 110], [30, 110], [60, 110], [80, 110], [100, 110], [130, 110], [150, 110], [180, 110],
                                        [20, 120], [40, 120], [70, 120], [90, 120], [110, 120], [140, 120], [160, 120],
                                        [70, 130], [80, 130], [100, 130], [120, 130], [150, 130], [170, 130], [180, 130],
                                        [70, 140], [90, 140], [110, 140], [130, 140], [160, 140],
                                        [70, 150], [80, 150], [100, 150], [120, 150], [140, 150], [170, 150], [180, 150],
                                        [70, 160], [90, 160], [110, 160], [150, 160], [160, 160],
                                        [70, 170], [80, 170], [100, 170], [130, 170], [140, 170], [170, 170], [180, 170],
                                        [70, 180], [90, 180], [110, 180], [120, 180], [150, 180], [160, 180], [180, 180],
                                    ].map(([x, y], i) => (
                                        <rect key={i} x={x} y={y} width="8" height="8" fill="black" rx="1" />
                                    ))}

                                    {/* Timing pattern */}
                                    {[70, 90, 110, 130].map(pos => (
                                        <rect key={`h${pos}`} x={pos} y="62" width="8" height="8" fill="black" rx="1" />
                                    ))}
                                    {[70, 90, 110, 130].map(pos => (
                                        <rect key={`v${pos}`} x="62" y={pos} width="8" height="8" fill="black" rx="1" />
                                    ))}
                                </svg>
                            </div>

                            <p className="text-sm font-body text-on-surface font-medium mb-1">Scan with Expo Go</p>
                            <p className="text-xs text-on-surface-variant/50 max-w-xs mx-auto">
                                Open the Expo Go app on your phone and scan this QR code to run VintageMusic on your mobile device
                            </p>
                            <div className="mt-3 flex items-center justify-center gap-2">
                                <span className="text-[10px] font-label uppercase tracking-wider font-bold text-tertiary bg-tertiary/10 px-3 py-1 rounded-full">
                                    exp://192.168.1.100:8081
                                </span>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </motion.section>

            {/* Quick Play All */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-center pb-4"
            >
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                        if (tracks.length > 0) handlePlay(tracks[Math.floor(Math.random() * tracks.length)]);
                    }}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full font-label font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all"
                >
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>shuffle</span>
                    Shuffle Play All
                </motion.button>
            </motion.div>
        </div>
    );
}
