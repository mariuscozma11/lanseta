import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Marker } from 'react-native-maps'
import { FishingSpot } from '../types/database'
import { Colors } from '../constants/Colors'

interface FishingSpotMarkerProps {
  spot: FishingSpot
  onPress?: (spot: FishingSpot) => void
}

export default function FishingSpotMarker({ spot, onPress }: FishingSpotMarkerProps) {
  const isFree = spot.price === 0 || spot.price === null || spot.price === undefined
  const isPremium = spot.price && spot.price >= 25
  
  return (
    <Marker
      coordinate={{
        latitude: spot.latitude,
        longitude: spot.longitude,
      }}
      onPress={() => onPress?.(spot)}
      tracksViewChanges={false}
    >
      <View style={[
        styles.markerContainer, 
        isFree ? styles.freeMarker : isPremium ? styles.premiumMarker : styles.paidMarker
      ]}>
        <View style={[
          styles.pinContainer,
          isFree ? styles.freePinContainer : isPremium ? styles.premiumPinContainer : styles.paidPinContainer
        ]}>
          <Text style={styles.fishIcon}>🎣</Text>
          <View style={styles.pinPoint} />
        </View>
        <View style={[styles.priceTag, isFree ? styles.freeTag : isPremium ? styles.premiumTag : styles.paidTag]}>
          <Text style={[styles.priceText, isFree ? styles.freePriceText : styles.whitePriceText]}>
            {isFree ? 'GRATUIT' : `${spot.price} RON`}
          </Text>
        </View>
      </View>
    </Marker>
  )
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 70,
    height: 80,
  },
  freeMarker: {
    // Green theme for free spots
  },
  paidMarker: {
    // Blue theme for paid spots  
  },
  premiumMarker: {
    // Orange theme for premium spots
  },
  pinContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 3,
    borderColor: Colors.neutral.white,
  },
  freePinContainer: {
    backgroundColor: Colors.map.freeSpot,
  },
  paidPinContainer: {
    backgroundColor: Colors.map.paidSpot,
  },
  premiumPinContainer: {
    backgroundColor: Colors.map.premiumSpot,
  },
  pinPoint: {
    position: 'absolute',
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.neutral.white,
  },
  fishIcon: {
    fontSize: 28,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  priceTag: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  freeTag: {
    backgroundColor: Colors.map.freeSpot,
  },
  paidTag: {
    backgroundColor: Colors.map.paidSpot,
  },
  premiumTag: {
    backgroundColor: Colors.map.premiumSpot,
  },
  priceText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  whitePriceText: {
    color: Colors.neutral.white,
  },
  freePriceText: {
    color: Colors.neutral.white,
  },
})