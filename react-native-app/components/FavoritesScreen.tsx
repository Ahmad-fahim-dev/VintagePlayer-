import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useMusic } from '../context/MusicContext';

export default function FavoritesScreen({ onNavigateToPlayer }: any) {
  const { tracks, favorites, playTrack, toggleFavorite } = useMusic();
  const favoriteTracks = tracks.filter(t => favorites.includes(t.id));

  const handlePlay = (track: any) => {
    playTrack(track);
    onNavigateToPlayer();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>Favorites</Text>
      <Text style={styles.subtitle}>Your cherished analog collection.</Text>
      
      <View style={styles.list}>
        {favoriteTracks.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="heart-broken" size={64} color="rgba(88,65,65,0.5)" />
            <Text style={styles.emptyText}>No favorites yet.</Text>
          </View>
        ) : (
          favoriteTracks.map(track => (
            <TouchableOpacity key={track.id} style={styles.trackItem} onPress={() => handlePlay(track)} activeOpacity={0.8}>
              <Image source={{ uri: track.image }} style={styles.trackImage} />
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(track.id)} style={styles.favBtn}>
                <MaterialIcons name="favorite" size={24} color="#8b0000" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  headerTitle: { fontSize: 36, fontWeight: 'bold', color: '#8b0000', marginBottom: 4, letterSpacing: -1 },
  subtitle: { fontSize: 14, color: '#584141', marginBottom: 24 },
  list: { paddingBottom: 40 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontStyle: 'italic', color: '#584141', marginTop: 16, fontSize: 16 },
  trackItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#eaddc5', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 12 
  },
  trackImage: { width: 56, height: 56, borderRadius: 4, marginRight: 12 },
  trackInfo: { flex: 1 },
  trackTitle: { fontSize: 16, fontWeight: '600', color: '#2d2424' },
  trackArtist: { fontSize: 12, color: '#584141', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
  favBtn: { padding: 8 }
});
