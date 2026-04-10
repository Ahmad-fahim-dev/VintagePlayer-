import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TopBar() {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.iconButton}>
        <MaterialIcons name="settings" size={24} color="#584141" />
      </TouchableOpacity>
      <Text style={styles.title}>VintageMusic</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    height: 60, 
    paddingHorizontal: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(88,65,65,0.1)' 
  },
  iconButton: { padding: 8 },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#8b0000', 
    fontStyle: 'italic' 
  }
});
