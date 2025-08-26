import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FishCatch } from '../types/journal'
import PhotoViewer from './PhotoViewer'
import { Colors } from '../constants/Colors'

interface SessionPhotoGalleryProps {
  photos: string[]
  catches: FishCatch[]
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const PHOTO_SIZE = (SCREEN_WIDTH - 60) / 3 // 3 photos per row with margins

export default function SessionPhotoGallery({ photos, catches }: SessionPhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [showPhotoViewer, setShowPhotoViewer] = useState(false)

  // Create photo metadata for context
  const photoMetadata = photos.map(photo => {
    // Find which catch this photo belongs to
    const catchIndex = catches.findIndex(catch_ => catch_.photos?.includes(photo))
    return {
      uri: photo,
      context: catchIndex >= 0 ? `Captura #${catchIndex + 1}` : 'Sesiune',
      catchInfo: catchIndex >= 0 ? catches[catchIndex] : undefined
    }
  })

  const handlePhotoPress = (index: number) => {
    setSelectedPhotoIndex(index)
    setShowPhotoViewer(true)
  }

  const handleClosePhotoViewer = () => {
    setShowPhotoViewer(false)
    setSelectedPhotoIndex(null)
  }

  if (photos.length === 0) return null

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="images" size={20} color={Colors.primary.blue} />
          <Text style={styles.title}>
            Galeria Sesiunii ({photos.length} {photos.length === 1 ? 'poză' : 'poze'})
          </Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {photos.map((photo, index) => {
          const metadata = photoMetadata[index]
          return (
            <TouchableOpacity
              key={index}
              style={styles.photoContainer}
              onPress={() => handlePhotoPress(index)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: photo }} style={styles.photo} />
              
              {/* Photo overlay with context */}
              <View style={styles.photoOverlay}>
                <View style={styles.photoLabel}>
                  <Text style={styles.photoLabelText}>{metadata.context}</Text>
                </View>
              </View>

              {/* Photo number indicator */}
              <View style={styles.photoNumber}>
                <Text style={styles.photoNumberText}>{index + 1}</Text>
              </View>
            </TouchableOpacity>
          )
        })}

        {/* Add more photos placeholder */}
        <View style={styles.addPhotoPlaceholder}>
          <View style={styles.addPhotoIcon}>
            <Ionicons name="camera" size={24} color={Colors.light.textSecondary} />
          </View>
          <Text style={styles.addPhotoText}>Adaugă mai multe poze în sesiunile viitoare</Text>
        </View>
      </ScrollView>

      {/* Photo stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="images" size={16} color={Colors.primary.blue} />
          <Text style={styles.statText}>{photos.length} poze totale</Text>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="fish" size={16} color={Colors.secondary.lightGreen} />
          <Text style={styles.statText}>
            {catches.filter(c => c.photos && c.photos.length > 0).length} capturi cu poze
          </Text>
        </View>
      </View>

      {/* Photo Viewer Modal */}
      <PhotoViewer
        visible={showPhotoViewer}
        photos={photoMetadata}
        initialIndex={selectedPhotoIndex || 0}
        onClose={handleClosePhotoViewer}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary.blue,
  },
  scrollContainer: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.light.backgroundSecondary,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  photoLabel: {
    alignItems: 'center',
  },
  photoLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  photoNumber: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  addPhotoPlaceholder: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  addPhotoIcon: {
    marginBottom: 8,
  },
  addPhotoText: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
})