import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function BottomNav({ currentScreen, setCurrentScreen }: any) {
  const navItems = [
    { id: 'library', label: 'Library', icon: 'library-music' },
    { id: 'player', label: 'Play', icon: 'play-circle-filled' },
    { id: 'favorites', label: 'Favorites', icon: 'favorite' }
  ];

  return (
    <View style={styles.nav}>
      {navItems.map(item => {
        const isActive = currentScreen === item.id;
        return (
          <TouchableOpacity 
            key={item.id} 
            style={styles.navItem} 
            onPress={() => setCurrentScreen(item.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
              <MaterialIcons 
                name={item.icon as any} 
                size={24} 
                color={isActive ? '#ffdad6' : '#584141'} 
              />
            </View>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    height: 80, 
    backgroundColor: '#eaddc5', 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(88,65,65,0.2)', 
    paddingBottom: 20,
    paddingTop: 8
  },
  navItem: { alignItems: 'center', justifyContent: 'center', width: 80 },
  iconContainer: { 
    width: 56, 
    height: 32, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  activeIconContainer: { backgroundColor: '#410002' },
  label: { fontSize: 10, fontWeight: 'bold', marginTop: 4, color: '#584141' },
  activeLabel: { color: '#2d2424' }
});
