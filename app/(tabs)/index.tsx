import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, ScrollView } from 'react-native';
import { sampleFishingSpots } from '@/src/data/fishingSpots';
import { FishingSpot } from '@/src/types/database';
import FishingSpotModal from '@/src/components/FishingSpotModal';
import SolunarCard from '@/src/components/SolunarCard';
import HourlyActivityChart from '@/src/components/HourlyActivityChart';
import { calculateSolunarScore, SolunarData } from '@/src/utils/solunarUtils';
import { Colors } from '@/src/constants/Colors';

// Platform-specific map imports
let FishingMap: any
if (Platform.OS === 'web') {
  FishingMap = require('@/src/components/FishingMap.web').default
} else {
  FishingMap = require('@/src/components/FishingMap').default
}

export default function MapScreen() {
  const [selectedSpot, setSelectedSpot] = useState<FishingSpot | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [solunarData, setSolunarData] = useState<SolunarData | null>(null)

  useEffect(() => {
    // Calculate solunar data for today
    const today = new Date()
    const data = calculateSolunarScore(today)
    setSolunarData(data)
  }, [])

  const handleSpotPress = (spot: FishingSpot) => {
    if (Platform.OS === 'web') {
      // Keep alert for web
      const priceText = spot.price ? `${spot.price} RON/zi` : 'Gratuit'
      const speciesText = spot.species.join(', ')
      
      alert(`${spot.name}\n\n${spot.description}\n\n💰 Preț: ${priceText}\n🐟 Specii: ${speciesText}\n\n📋 Reguli:\n${spot.rules}`)
    } else {
      // Use custom modal for mobile
      setSelectedSpot(spot)
      setModalVisible(true)
    }
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedSpot(null)
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <FishingMap
          spots={sampleFishingSpots}
          onSpotPress={handleSpotPress}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {solunarData && (
        <SolunarCard data={solunarData} compact />
      )}
      
      <View style={styles.mapContainer}>
        <FishingMap
          spots={sampleFishingSpots}
          onSpotPress={handleSpotPress}
        />
      </View>

      {solunarData && (
        <>
          <SolunarCard data={solunarData} />
          <HourlyActivityChart data={solunarData} />
        </>
      )}

      <FishingSpotModal
        visible={modalVisible}
        spot={selectedSpot}
        onClose={handleCloseModal}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  mapContainer: {
    height: 300,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
