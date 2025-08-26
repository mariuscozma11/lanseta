import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Dimensions, Alert, TouchableOpacity, Text } from 'react-native'
import MapView, { Region } from 'react-native-maps'
import * as Location from 'expo-location'
import { FishingSpot } from '../types/database'
import FishingSpotMarker from './FishingSpotMarker'
import { Colors } from '../constants/Colors'

interface FishingMapProps {
  spots: FishingSpot[]
  onSpotPress?: (spot: FishingSpot) => void
}

const { width } = Dimensions.get('window')

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
  const mapRef = useRef<MapView>(null)

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

  const recenterMap = () => {
    if (userLocation) {
      const { latitude, longitude } = userLocation.coords
      if (latitude > 45.0 && latitude < 46.5 && longitude > 20.0 && longitude < 22.5) {
        // User is in Timis county, center on them
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }
        mapRef.current?.animateToRegion(newRegion, 1000)
        return
      }
    }
    
    // Default to Timisoara
    mapRef.current?.animateToRegion(TIMISOARA_REGION, 1000)
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
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
      
      <TouchableOpacity style={styles.recenterButton} onPress={recenterMap}>
        <Text style={styles.recenterIcon}>📍</Text>
        <Text style={styles.recenterText}>Centrează</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  recenterButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.neutral.white,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  recenterIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  recenterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary.blue,
  },
})