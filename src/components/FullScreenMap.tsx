import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Region } from 'react-native-maps'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import { FishingSpot } from '../types/database'
import FishingSpotMarker from './FishingSpotMarker'
import FishingSpotModal from './FishingSpotModal'
import { Colors } from '../constants/Colors'

interface FullScreenMapProps {
  visible: boolean
  spots: FishingSpot[]
  onClose: () => void
}

// Default region centered on Timisoara
const TIMISOARA_REGION: Region = {
  latitude: 45.7489,
  longitude: 21.2087,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
}

export default function FullScreenMap({ visible, spots, onClose }: FullScreenMapProps) {
  const [region, setRegion] = useState<Region>(TIMISOARA_REGION)
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null)
  const [selectedSpot, setSelectedSpot] = useState<FishingSpot | null>(null)
  const [spotModalVisible, setSpotModalVisible] = useState(false)
  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    if (visible) {
      getUserLocation()
    }
  }, [visible])

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
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
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }
        mapRef.current?.animateToRegion(newRegion, 1000)
        return
      }
    }
    
    // Default to Timisoara
    mapRef.current?.animateToRegion(TIMISOARA_REGION, 1000)
  }

  const handleSpotPress = (spot: FishingSpot) => {
    setSelectedSpot(spot)
    setSpotModalVisible(true)
  }

  const handleCloseSpotModal = () => {
    setSpotModalVisible(false)
    setSelectedSpot(null)
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={18} color={Colors.light.textSecondary} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Ionicons name="fish" size={20} color={Colors.primary.blue} />
            <Text style={styles.title}>Harta Pescuit - Timiș</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

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
              onPress={handleSpotPress}
            />
          ))}
        </MapView>
        
        <TouchableOpacity style={styles.recenterButton} onPress={recenterMap}>
          <Ionicons name="locate" size={16} color={Colors.primary.blue} />
          <Text style={styles.recenterText}>Centrează</Text>
        </TouchableOpacity>

        <FishingSpotModal
          visible={spotModalVisible}
          spot={selectedSpot}
          onClose={handleCloseSpotModal}
        />
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary.blue,
  },
  placeholder: {
    width: 36,
  },
  map: {
    flex: 1,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 40,
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
  recenterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary.blue,
  },
})