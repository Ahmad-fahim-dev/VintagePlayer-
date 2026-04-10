import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useMusic } from '../context/MusicContext';

export default function PlayerScreen({ onBack }: any) {
  const { 
    currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, 
    favorites, toggleFavorite, shuffle, toggleShuffle, repeat, toggleRepeat
  } = useMusic();
  
  const [progress, setProgress] = useState(0);
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => setProgress(p => (p >= 100 ? 0 : p + 0.5)), 1000);
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 10000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
    } else {
      spinValue.stopAnimation();
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!currentTrack) return null;

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <MaterialIcons name="keyboard-arrow-down" size={32} color="#2d2424" />
        </TouchableOpacity>
        <Text style={styles.headerText}>CURRENT REEL</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="more-vert" size={28} color="#2d2424" />
        </TouchableOpacity>
      </View>

      <View style={styles.albumContainer}>
        <Animated.View style={[styles.vinylRecord, isPlaying && { transform: [{ rotate: spin }] }]}>
          <Image source={{ uri: currentTrack.image }} style={styles.albumArt} />
          <View style={styles.vinylCenter} />
        </Animated.View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(currentTrack.id)} style={{ padding: 4 }}>
            <MaterialIcons name={favorites.includes(currentTrack.id) ? "favorite" : "favorite-border"} size={28} color="#8b0000" />
          </TouchableOpacity>
        </View>
        <Text style={styles.artist}>{currentTrack.artist}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>00:{(Math.floor(progress) % 60).toString().padStart(2, '0')}</Text>
          <Text style={styles.timeText}>04:15</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleShuffle} style={styles.controlBtn}>
          <MaterialIcons name="shuffle" size={28} color={shuffle ? "#8b0000" : "#584141"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={prevTrack} style={styles.controlBtn}>
          <MaterialIcons name="skip-previous" size={44} color="#584141" />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlay} style={styles.playBtn} activeOpacity={0.8}>
          <MaterialIcons name={isPlaying ? "pause" : "play-arrow"} size={48} color="#ffdad6" />
        </TouchableOpacity>
        <TouchableOpacity onPress={nextTrack} style={styles.controlBtn}>
          <MaterialIcons name="skip-next" size={44} color="#584141" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleRepeat} style={styles.controlBtn}>
          <MaterialIcons name="repeat" size={28} color={repeat ? "#8b0000" : "#584141"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 10 },
  header: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8 },
  iconBtn: { padding: 12 },
  headerText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 2, color: '#8b0000' },
  albumContainer: { width: 300, height: 300, justifyContent: 'center', alignItems: 'center', marginVertical: 40 },
  vinylRecord: { width: 280, height: 280, borderRadius: 140, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#333' },
  albumArt: { width: 110, height: 110, borderRadius: 55 },
  vinylCenter: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: '#f4ecd8' },
  infoContainer: { width: '100%', paddingHorizontal: 24, alignItems: 'center', marginBottom: 30 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2d2424', fontStyle: 'italic', maxWidth: '80%' },
  artist: { fontSize: 16, color: '#584141' },
  progressContainer: { width: '100%', paddingHorizontal: 32, marginBottom: 40 },
  progressBarBg: { height: 6, backgroundColor: '#eaddc5', borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  progressBarFill: { height: '100%', backgroundColor: '#8b0000' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { fontSize: 10, fontWeight: 'bold', color: '#584141' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, width: '100%', paddingHorizontal: 16 },
  controlBtn: { padding: 8 },
  playBtn: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#8b0000', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#8b0000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, marginHorizontal: 8 }
});
