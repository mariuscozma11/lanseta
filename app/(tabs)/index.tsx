import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sampleFishingSpots } from '@/src/data/fishingSpots';
import { FishingSpot } from '@/src/types/database';
import FishingSpotModal from '@/src/components/FishingSpotModal';
import SolunarCard from '@/src/components/SolunarCard';
import HourlyActivityChart from '@/src/components/HourlyActivityChart';
import FishingMap from '@/src/components/FishingMap';
import FullScreenMap from '@/src/components/FullScreenMap';
import { calculateSolunarScore, SolunarData } from '@/src/utils/solunarUtils';
import { Colors } from '@/src/constants/Colors';

export default function MapScreen() {
  const [selectedSpot, setSelectedSpot] = useState<FishingSpot | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [fullScreenMapVisible, setFullScreenMapVisible] = useState(false)
  const [solunarData, setSolunarData] = useState<SolunarData | null>(null)

  useEffect(() => {
    // Calculate solunar data for today
    const today = new Date()
    const data = calculateSolunarScore(today)
    setSolunarData(data)
  }, [])

  const handleSpotPress = (spot: FishingSpot) => {
    setSelectedSpot(spot)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedSpot(null)
  }

  const handleMaximizeMap = () => {
    setFullScreenMapVisible(true)
  }

  const handleCloseFullScreenMap = () => {
    setFullScreenMapVisible(false)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {solunarData && (
          <SolunarCard data={solunarData} compact />
        )}
        
        <View style={styles.mapContainer}>
          <FishingMap
            spots={sampleFishingSpots}
            onSpotPress={handleSpotPress}
            onMaximize={handleMaximizeMap}
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

        <FullScreenMap
          visible={fullScreenMapVisible}
          spots={sampleFishingSpots}
          onClose={handleCloseFullScreenMap}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  container: {
    flex: 1,
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
