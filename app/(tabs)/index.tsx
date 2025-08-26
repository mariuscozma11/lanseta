import React, { useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { RomanianText } from '@/src/localization/ro';
import { sampleFishingSpots } from '@/src/data/fishingSpots';
import { FishingSpot } from '@/src/types/database';
import FishingSpotModal from '@/src/components/FishingSpotModal';

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

  return (
    <View style={styles.container}>
      <FishingMap
        spots={sampleFishingSpots}
        onSpotPress={handleSpotPress}
      />
      <FishingSpotModal
        visible={modalVisible}
        spot={selectedSpot}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
