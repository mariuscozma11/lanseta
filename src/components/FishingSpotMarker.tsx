import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Marker } from 'react-native-maps'
import { FishingSpot } from '../types/database'

interface FishingSpotMarkerProps {
  spot: FishingSpot
  onPress?: (spot: FishingSpot) => void
}

export default function FishingSpotMarker({ spot, onPress }: FishingSpotMarkerProps) {
  const isFree = spot.price === 0 || spot.price === null || spot.price === undefined
  
  return (
    <Marker
      coordinate={{
        latitude: spot.latitude,
        longitude: spot.longitude,
      }}
      onPress={() => onPress?.(spot)}
    >
      <View style={[styles.markerContainer, isFree ? styles.freeMarker : styles.paidMarker]}>
        <Text style={styles.fishIcon}>🎣</Text>
        <View style={[styles.priceTag, isFree ? styles.freeTag : styles.paidTag]}>
          <Text style={styles.priceText}>
            {isFree ? 'Gratuit' : `${spot.price} RON`}
          </Text>
        </View>
      </View>
    </Marker>
  )
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  freeMarker: {
    // Green theme for free spots
  },
  paidMarker: {
    // Blue theme for paid spots  
  },
  fishIcon: {
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  priceTag: {
    marginTop: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  freeTag: {
    backgroundColor: '#4CAF50',
  },
  paidTag: {
    backgroundColor: '#2196F3',
  },
  priceText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})