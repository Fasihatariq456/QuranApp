import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Animated, LayoutAnimation, UIManager, Platform } from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

const QuranApp = () => {
  const [surahData, setSurahData] = useState([]);      // State to store fetched Surah data
  const [loading, setLoading] = useState(true);        // State to manage loading indicator
  const [selectedSurah, setSelectedSurah] = useState(null); // State for selected Surah details
  const [expandedSurahId, setExpandedSurahId] = useState(null); // Track which Surah is expanded
  const [animation, setAnimation] = useState(new Animated.Value(0)); // For slide-down animation

  // Fetch Surah data from the API when component mounts
  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(response => response.json())
      .then(data => {
        setSurahData(data.data);  // Set Surah data from API response
        setLoading(false);        // Hide loading indicator
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);        // Hide loading indicator in case of error
      });
  }, []);

  // Fetch details for a specific Surah
  const fetchSurahDetails = (surahId) => {
    if (expandedSurahId === surahId) {
      // If the Surah is already expanded, collapse it
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate closing
      setExpandedSurahId(null);
      return;
    }

    setLoading(true);  // Show loading indicator when fetching details
    fetch(`https://api.alquran.cloud/v1/surah/${surahId}/en.asad`)
      .then(response => response.json())
      .then(data => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Smooth expansion animation
        setSelectedSurah(data.data);  // Set the detailed Surah
        setExpandedSurahId(surahId);  // Track which Surah is expanded
        setLoading(false);            // Hide loading indicator
      })
      .catch(error => {
        console.error('Error fetching Surah details:', error);
        setLoading(false);            // Hide loading indicator in case of error
      });
  };

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

      {/* Loading indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" />
      ) : (
        <ScrollView style={styles.surahList}>
          {surahData.map((surah, index) => (
            <View key={index} style={styles.surahItem}>
              <TouchableOpacity onPress={() => fetchSurahDetails(surah.number)}>
                <View style={styles.surahInfo}>
                  <Text style={styles.surahNumber}>{surah.number}</Text>
                  <View>
                    <Text style={styles.surahNameItem}>{surah.englishName}</Text>
                    <Text style={styles.surahDetails}>{surah.revelationType.toUpperCase()} - {surah.numberOfAyahs} VERSES</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <Text style={styles.surahArabic}>{surah.name}</Text>

              {/* Display detailed Surah when selected */}
              {expandedSurahId === surah.number && selectedSurah && (
                <View style={styles.expandedSurahContainer}>
                  <Text style={styles.surahDetailsText}>
                    {selectedSurah.ayahs.map((ayah, idx) => (
                      <Text key={idx}>
                        {ayah.numberInSurah}. {ayah.text}{"\n"}
                      </Text>
                    ))}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

// Styles
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
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  expandedSurahContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  surahDetailsText: {
    fontSize: 16,
    color: '#000',
  },
});

export default QuranApp;
