import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useMusic } from '../context/MusicContext';

export default function LibraryScreen({ onNavigateToPlayer }: any) {
  const { tracks, favorites, playTrack, toggleFavorite } = useMusic();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTracks = tracks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlay = (track: any) => {
    playTrack(track);
    onNavigateToPlayer();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>Your Library</Text>
      
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#584141" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search archives..."
          placeholderTextColor="#584141"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.list}>
        {filteredTracks.length === 0 ? (
          <Text style={styles.emptyText}>No tracks found.</Text>
        ) : (
          filteredTracks.map(track => (
            <TouchableOpacity key={track.id} style={styles.trackItem} onPress={() => handlePlay(track)} activeOpacity={0.8}>
              <Image source={{ uri: track.image }} style={styles.trackImage} />
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(track.id)} style={styles.favBtn}>
                <MaterialIcons name={favorites.includes(track.id) ? "favorite" : "favorite-border"} size={24} color="#8b0000" />
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
  headerTitle: { fontSize: 36, fontWeight: 'bold', color: '#8b0000', marginBottom: 16, letterSpacing: -1 },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(234,221,197,0.5)', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    height: 52, 
    marginBottom: 24 
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#2d2424', fontStyle: 'italic' },
  list: { paddingBottom: 40 },
  emptyText: { fontStyle: 'italic', color: '#584141', textAlign: 'center', marginTop: 32 },
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
