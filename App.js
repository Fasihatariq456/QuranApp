import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';

// Enable Layout Animation for Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Custom Hook for fetching Surah List
const useSurahList = () => {
  const [surahData, setSurahData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurahList = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSurahData(data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahList();
  }, []);

  return { surahData, loading, error };
};

// Custom Hook for fetching Surah Details
const useSurahDetails = () => {
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSurahDetails = async (surahId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/en.asad`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSelectedSurah(data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { selectedSurah, loading, error, fetchSurahDetails };
};

// Main Component
const QuranApp = () => {
  const { surahData, loading: loadingList, error: errorList } = useSurahList();
  const { selectedSurah, loading: loadingDetails, error: errorDetails, fetchSurahDetails } = useSurahDetails();
  const [expandedSurahId, setExpandedSurahId] = useState(null); // Track which Surah is expanded

  const handlePress = (surahId) => {
    if (expandedSurahId === surahId) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpandedSurahId(null);
    } else {
      fetchSurahDetails(surahId);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpandedSurahId(surahId);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.surahItem}>
      <TouchableOpacity onPress={() => handlePress(item.number)}>
        <View style={styles.surahInfo}>
          <View style={styles.leftSection}>
            <Text style={styles.surahNumber}>{item.number}</Text>
            <Text style={styles.surahNameItem}>{item.englishName}</Text>
            <Text style={styles.surahDetails}>
              {item.revelationType.toUpperCase()} - {item.numberOfAyahs} VERSES
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Text style={styles.surahArabic}>{item.name}</Text>

      {/* Display detailed Surah when selected */}
      {expandedSurahId === item.number && selectedSurah && (
        <View style={styles.expandedSurahContainer}>
          <Text style={styles.surahDetailsText}>
            {selectedSurah.ayahs.map((ayah, idx) => (
              <Text key={idx}>
                {ayah.numberInSurah}. {ayah.text}
                {'\n'}
              </Text>
            ))}
          </Text>
        </View>
      )}
    </View>
  );

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
      {loadingList ? (
        <ActivityIndicator size="large" color="#6C63FF" />
      ) : (
        <FlatList
          data={surahData}
          renderItem={renderItem}
          keyExtractor={(item) => item.number.toString()}
        />
      )}

      {/* Error handling */}
      {errorList && <Text style={styles.errorText}>Error fetching Surah list: {errorList.message}</Text>}
      {errorDetails && <Text style={styles.errorText}>Error fetching Surah details: {errorDetails.message}</Text>}
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
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  surahInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align items to the left
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
  },
  surahNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  surahNameItem: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  surahDetails: {
    fontSize: 14,
    color: '#A0A3BD',
  },
  surahArabic: {
    fontSize: 30,
    textAlign: 'right',
  },
  expandedSurahContainer: {
    marginTop: 10,
    backgroundColor: '#E9E9E9',
    padding: 10,
    borderRadius: 8,
  },
  surahDetailsText: {
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default QuranApp;
