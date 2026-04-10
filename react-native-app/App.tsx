import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, StatusBar } from 'react-native';
import { MusicProvider } from './context/MusicContext';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import LibraryScreen from './components/LibraryScreen';
import PlayerScreen from './components/PlayerScreen';
import FavoritesScreen from './components/FavoritesScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('library');

  return (
    <MusicProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f4ecd8" />
        <TopBar />
        <View style={styles.main}>
          {currentScreen === 'library' && (
            <LibraryScreen onNavigateToPlayer={() => setCurrentScreen('player')} />
          )}
          {currentScreen === 'player' && (
            <PlayerScreen onBack={() => setCurrentScreen('library')} />
          )}
          {currentScreen === 'favorites' && (
            <FavoritesScreen onNavigateToPlayer={() => setCurrentScreen('player')} />
          )}
        </View>
        <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      </SafeAreaView>
    </MusicProvider>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f4ecd8' 
  },
  main: { 
    flex: 1, 
    paddingHorizontal: 16 
  }
});
