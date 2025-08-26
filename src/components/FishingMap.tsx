import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Dimensions, Alert } from 'react-native'
import MapView, { Region } from 'react-native-maps'
import * as Location from 'expo-location'
import { FishingSpot } from '../types/database'
import FishingSpotMarker from './FishingSpotMarker'

interface FishingMapProps {
  spots: FishingSpot[]
  onSpotPress?: (spot: FishingSpot) => void
}

const { width, height } = Dimensions.get('window')

// Default region centered on Timisoara
const TIMISOARA_REGION: Region = {
  latitude: 45.7489,
  longitude: 21.2087,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
}

export default function FishingMap({ spots, onSpotPress }: FishingMapProps) {
  const [region, setRegion] = useState<Region>(TIMISOARA_REGION)
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
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        showsPointsOfInterest={false}
        mapType="standard"
        toolbarEnabled={false}
        moveOnMarkerPress={false}
      >
        {spots.map((spot) => (
          <FishingSpotMarker
            key={spot.id}
            spot={spot}
            onPress={onSpotPress}
          />
        ))}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height - 100, // Account for tab bar
  },
})