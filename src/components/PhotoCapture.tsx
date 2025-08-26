import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { Colors } from '../constants/Colors'

interface PhotoCaptureProps {
  photos: string[]
  onPhotosChange: (photos: string[]) => void
  maxPhotos?: number
}

const { width } = Dimensions.get('window')

export default function PhotoCapture({ photos, onPhotosChange, maxPhotos = 3 }: PhotoCaptureProps) {
  const [loading, setLoading] = useState(false)

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permisiuni Camera', 'Avem nevoie de acces la cameră pentru a face poze.')
      return false
    }
    return true
  }

  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permisiuni Galerie', 'Avem nevoie de acces la galeria foto pentru a selecta poze.')
      return false
    }
    return true
  }

  // Check and request permissions with better error handling
  const checkCameraPermissions = async () => {
    try {
      // First check if we already have permission
      const { status: currentStatus } = await ImagePicker.getCameraPermissionsAsync()
      
      if (currentStatus === 'granted') {
        return true
      }
      
      if (currentStatus === 'denied') {
        Alert.alert(
          'Permisiuni Camera',
          'Accesul la cameră a fost refuzat. Te rog să activezi permisiunile în setările aplicației.',
          [
            { text: 'OK', style: 'default' }
          ]
        )
        return false
      }
      
      // Request permission if not determined
      const { status: newStatus } = await ImagePicker.requestCameraPermissionsAsync()
      return newStatus === 'granted'
    } catch (error) {
      console.error('Camera permission check error:', error)
      return false
    }
  }

  const checkMediaLibraryPermissions = async () => {
    try {
      // First check if we already have permission
      const { status: currentStatus } = await ImagePicker.getMediaLibraryPermissionsAsync()
      
      if (currentStatus === 'granted') {
        return true
      }
      
      if (currentStatus === 'denied') {
        Alert.alert(
          'Permisiuni Galerie',
          'Accesul la galeria foto a fost refuzat. Te rog să activezi permisiunile în setările aplicației.',
          [
            { text: 'OK', style: 'default' }
          ]
        )
        return false
      }
      
      // Request permission if not determined
      const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      return newStatus === 'granted'
    } catch (error) {
      console.error('Media library permission check error:', error)
      return false
    }
  }

  const takePhoto = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert('Limită atinsă', `Poți adăuga maximum ${maxPhotos} poze.`)
      return
    }

    // Check and request camera permissions with better error handling
    const hasCameraPermission = await checkCameraPermissions()
    if (!hasCameraPermission) return

    try {
      setLoading(true)

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      })

      if (!result.canceled && result.assets[0]) {
        const newPhotos = [...photos, result.assets[0].uri]
        onPhotosChange(newPhotos)
      }
    } catch (error) {
      Alert.alert('Eroare Camera', 'Nu am putut face poza. Verifică permisiunile camerei în setări.')
      console.error('Photo capture error:', error)
    } finally {
      setLoading(false)
    }
  }

  const pickFromGallery = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert('Limită atinsă', `Poți adăuga maximum ${maxPhotos} poze.`)
      return
    }

    // Check and request media library permissions with better error handling
    const hasMediaPermission = await checkMediaLibraryPermissions()
    if (!hasMediaPermission) return

    try {
      setLoading(true)

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      })

      if (!result.canceled && result.assets[0]) {
        const newPhotos = [...photos, result.assets[0].uri]
        onPhotosChange(newPhotos)
      }
    } catch (error) {
      Alert.alert('Eroare Galerie', 'Nu am putut selecta poza. Verifică permisiunile galeriei în setări.')
      console.error('Photo picker error:', error)
    } finally {
      setLoading(false)
    }
  }

  const showPhotoOptions = () => {
    Alert.alert(
      'Adaugă Poză',
      'Alege opțiunea pentru a adăuga o poză:',
      [
        { text: 'Anulează', style: 'cancel' },
        { text: 'Camera', onPress: takePhoto },
        { text: 'Galerie', onPress: pickFromGallery }
      ]
    )
  }

  const removePhoto = (index: number) => {
    Alert.alert(
      'Șterge Poza',
      'Ești sigur că vrei să ștergi această poză?',
      [
        { text: 'Anulează', style: 'cancel' },
        { 
          text: 'Șterge', 
          style: 'destructive',
          onPress: () => {
            const newPhotos = photos.filter((_, i) => i !== index)
            onPhotosChange(newPhotos)
          }
        }
      ]
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Poze ({photos.length}/{maxPhotos})
      </Text>
      
      {photos.length > 0 && (
        <View style={styles.photosContainer}>
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: photo }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePhoto(index)}
              >
                <Ionicons name="close" size={16} color={Colors.neutral.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {photos.length < maxPhotos && (
        <TouchableOpacity
          style={[styles.addButton, loading && styles.addButtonDisabled]}
          onPress={showPhotoOptions}
          disabled={loading}
        >
          <View style={styles.addButtonIcon}>
            {loading ? (
              <Ionicons name="hourglass" size={20} color={Colors.primary.blue} />
            ) : (
              <Ionicons name="camera" size={20} color={Colors.primary.blue} />
            )}
          </View>
          <Text style={styles.addButtonText}>
            {loading ? 'Se procesează...' : 'Adaugă Poză'}
          </Text>
        </TouchableOpacity>
      )}

      {photos.length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="camera-outline" size={32} color={Colors.light.textSecondary} />
          <Text style={styles.emptyText}>
            Adaugă poze cu captura ta pentru amintiri!
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  photoContainer: {
    position: 'relative',
    width: (width - 64) / 3, // 3 photos per row with margins and gaps
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.light.backgroundSecondary,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary.blue,
    borderStyle: 'dashed',
    backgroundColor: Colors.primary.blue + '10',
    gap: 8,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.blue,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
})