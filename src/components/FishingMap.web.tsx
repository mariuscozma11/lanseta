import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Dimensions, Alert, Text } from 'react-native'
import * as Location from 'expo-location'
import { FishingSpot } from '../types/database'
import { Colors } from '../constants/Colors'

interface FishingMapProps {
  spots: FishingSpot[]
  onSpotPress?: (spot: FishingSpot) => void
}

const { width, height } = Dimensions.get('window')

// Default region centered on Timisoara
const TIMISOARA_REGION = {
  latitude: 45.7489,
  longitude: 21.2087,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
}

export default function FishingMapWeb({ spots, onSpotPress }: FishingMapProps) {
  const [region, setRegion] = useState(TIMISOARA_REGION)
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null)

  useEffect(() => {
    getUserLocation()
  }, [])

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permisiuni necesare', 'Aplicația are nevoie de acces la locație pentru a afișa harta corect.')
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setUserLocation(location)

      // Update region to center on user if within Timis county area
      const { latitude, longitude } = location.coords
      if (latitude > 45.0 && latitude < 46.5 && longitude > 20.0 && longitude < 22.5) {
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        })
      }
    } catch (error) {
      console.warn('Error getting location:', error)
    }
  }

  return (
    <View style={styles.fallbackContainer}>
      <div style={styles.webMapFallback}>
        <h2 style={styles.title}>🎣 Harta Locurilor de Pescuit - Timiș</h2>
        <p style={styles.subtitle}>Pentru o experiență completă cu hartă interactivă, utilizați aplicația mobilă.</p>
        <div style={styles.spotsList}>
          {spots.map((spot) => (
            <div 
              key={spot.id} 
              style={styles.spotItem}
              onClick={() => onSpotPress?.(spot)}
            >
              <h3 style={styles.spotTitle}>🎣 {spot.name}</h3>
              <p style={styles.spotDescription}>{spot.description}</p>
              <p style={styles.spotInfo}>
                <strong>Preț:</strong> {spot.price ? `${spot.price} RON/zi` : 'Gratuit'}
              </p>
              <p style={styles.spotInfo}>
                <strong>Specii:</strong> {spot.species.join(', ')}
              </p>
              <p style={styles.spotRules}>
                <strong>Reguli:</strong> {spot.rules}
              </p>
            </div>
          ))}
        </div>
      </div>
    </View>
  )
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  webMapFallback: {
    textAlign: 'center',
    color: Colors.light.text,
  } as any,
  title: {
    color: Colors.primary.blue,
    marginBottom: '10px',
    fontSize: '28px',
    fontWeight: 'bold',
  } as any,
  subtitle: {
    color: Colors.light.textSecondary,
    marginBottom: '30px',
    fontSize: '16px',
  } as any,
  spotsList: {
    marginTop: 20,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
    textAlign: 'left',
  } as any,
  spotItem: {
    border: `2px solid ${Colors.light.border}`,
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    backgroundColor: Colors.neutral.white,
    boxShadow: `0 4px 8px ${Colors.light.shadow}`,
    transition: 'all 0.2s ease',
  } as any,
  spotTitle: {
    color: Colors.primary.blue,
    marginBottom: '10px',
    fontSize: '20px',
    fontWeight: 'bold',
  } as any,
  spotDescription: {
    color: Colors.light.text,
    marginBottom: '15px',
    fontSize: '14px',
    lineHeight: '1.4',
  } as any,
  spotInfo: {
    color: Colors.light.textSecondary,
    marginBottom: '8px',
    fontSize: '14px',
  } as any,
  spotRules: {
    color: Colors.light.textSecondary,
    fontSize: '12px',
    fontStyle: 'italic',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: `1px solid ${Colors.light.borderLight}`,
  } as any,
})