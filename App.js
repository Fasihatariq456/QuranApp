import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

const QuranApp = () => {
  return (
    <View style={styles.container}>
      {/* Last Read Section */}
      <View style={styles.header}>
        <Text style={styles.lastReadText}>📖 Last Read</Text>
        <Text style={styles.surahName}>Al-Fatiah</Text>
        <Text style={styles.ayahText}>Ayah No: 1</Text>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1184/1184874.png' }} 
          style={styles.bookImage} 
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.tabTextActive}>Surah</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.tabText}>Para</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.tabText}>Page</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.tabText}>Hijb</Text>
        </TouchableOpacity>
      </View>

      {/* Surah List */}
      <ScrollView style={styles.surahList}>
        {surahData.map((surah, index) => (
          <View key={index} style={styles.surahItem}>
            <View style={styles.surahInfo}>
              <Text style={styles.surahNumber}>{surah.number}</Text>
              <View>
                <Text style={styles.surahNameItem}>{surah.name}</Text>
                <Text style={styles.surahDetails}>{surah.type} - {surah.verses} VERSES</Text>
              </View>
            </View>
            <Text style={styles.surahArabic}>{surah.arabic}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Sample Surah Data
const surahData = [
  { number: 1, name: 'Al-Fatiah', type: 'MECCAN', verses: 7, arabic: 'ٱلْفَاتِحَة' },
  { number: 2, name: 'Al-Baqarah', type: 'MEDINIAN', verses: 286, arabic: 'الْبَقَرَة' },
  { number: 3, name: 'Ali `Imran', type: 'MECCAN', verses: 200, arabic: 'آلِ عِمْرَان' },
  { number: 4, name: 'An-Nisa', type: 'MECCAN', verses: 176, arabic: 'النِّسَاء' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FC',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    backgroundColor: '#C1A3FF',
    borderRadius: 16,
    padding: 20,
    position: 'relative',
  },
  lastReadText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  surahName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  ayahText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  bookImage: {
    width: 60,
    height: 60,
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#6C63FF',
    paddingBottom: 5,
  },
  tabTextActive: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  tabText: {
    color: '#A0A3BD',
  },
  surahList: {
    marginTop: 10,
  },
  surahItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  surahInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahNumber: {
    backgroundColor: '#6C63FF',
    color: '#fff',
    borderRadius: 8,
    width: 30,
    height: 30,
    textAlign: 'center',
    lineHeight: 30,
    marginRight: 10,
  },
  surahNameItem: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  surahDetails: {
    color: '#A0A3BD',
    fontSize: 14,
  },
  surahArabic: {
    fontSize: 20,
    color: '#6C63FF',
    fontWeight: 'bold',
  },
});

export default QuranApp;
