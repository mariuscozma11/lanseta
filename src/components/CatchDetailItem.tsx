import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FishCatch } from '../types/journal'
import PhotoViewer from './PhotoViewer'
import { Colors } from '../constants/Colors'

interface CatchDetailItemProps {
  catch_: FishCatch
  index: number
  expanded?: boolean
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function CatchDetailItem({ 
  catch_, 
  index, 
  expanded: initialExpanded = false 
}: CatchDetailItemProps) {
  const [expanded, setExpanded] = useState(initialExpanded)
  const [showPhotoViewer, setShowPhotoViewer] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const handlePhotoPress = (photoIndex: number) => {
    setSelectedPhotoIndex(photoIndex)
    setShowPhotoViewer(true)
  }

  const photoMetadata = (catch_.photos || []).map(photo => ({
    uri: photo,
    context: `Captura #${index + 1}`,
    catchInfo: catch_
  }))

  return (
    <View style={styles.container}>
      {/* Header - Always visible */}
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.catchNumber}>
          <Text style={styles.catchNumberText}>#{index + 1}</Text>
        </View>

        <View style={styles.catchInfo}>
          <Text style={styles.catchSpecies}>{catch_.speciesName}</Text>
          <View style={styles.catchMeasurements}>
            <View style={styles.measurement}>
              <Ionicons name="resize" size={14} color={Colors.primary.blue} />
              <Text style={styles.measurementText}>{catch_.length}cm</Text>
            </View>
            
            <View style={styles.measurement}>
              <Ionicons name="scale" size={14} color={Colors.warning.orange} />
              <Text style={styles.measurementText}>{catch_.weight}kg</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          {catch_.photos && catch_.photos.length > 0 && (
            <View style={styles.photoCount}>
              <Ionicons name="camera" size={12} color={Colors.light.textSecondary} />
              <Text style={styles.photoCountText}>{catch_.photos.length}</Text>
            </View>
          )}
          
          <View style={styles.statusBadge}>
            {catch_.released ? (
              <View style={styles.releasedBadge}>
                <Ionicons name="leaf" size={12} color={Colors.secondary.lightGreen} />
                <Text style={styles.releasedText}>Eliberat</Text>
              </View>
            ) : (
              <View style={styles.keptBadge}>
                <Ionicons name="fish" size={12} color={Colors.primary.blue} />
                <Text style={styles.keptText}>Păstrat</Text>
              </View>
            )}
          </View>

          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={Colors.light.textSecondary} 
          />
        </View>
      </TouchableOpacity>

      {/* Expanded Content */}
      {expanded && (
        <View style={styles.expandedContent}>
          {/* Photos */}
          {catch_.photos && catch_.photos.length > 0 && (
            <View style={styles.photosSection}>
              <Text style={styles.sectionTitle}>Poze Captură</Text>
              
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.photosScroll}
                contentContainerStyle={styles.photosContainer}
              >
                {catch_.photos.map((photo, photoIndex) => (
                  <TouchableOpacity
                    key={photoIndex}
                    style={styles.photoThumbnail}
                    onPress={() => handlePhotoPress(photoIndex)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: photo }} style={styles.thumbnailImage} />
                    
                    <View style={styles.photoOverlay}>
                      <Ionicons name="expand" size={16} color={Colors.neutral.white} />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Detailed Information */}
          <View style={styles.detailsSection}>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Ionicons name="resize" size={16} color={Colors.primary.blue} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Lungime</Text>
                  <Text style={styles.detailValue}>{catch_.length} cm</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="scale" size={16} color={Colors.warning.orange} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Greutate</Text>
                  <Text style={styles.detailValue}>{catch_.weight} kg</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Ionicons 
                  name={catch_.released ? "leaf" : "fish"} 
                  size={16} 
                  color={catch_.released ? Colors.secondary.lightGreen : Colors.primary.blue} 
                />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={styles.detailValue}>
                    {catch_.released ? 'Eliberat' : 'Păstrat'}
                  </Text>
                </View>
              </View>

              {/* Species info could be added here */}
              <View style={styles.detailItem}>
                <Ionicons name="information-circle" size={16} color={Colors.accent.gold} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Specie</Text>
                  <Text style={styles.detailValue}>{catch_.speciesName}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Notes */}
          {catch_.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>Observații</Text>
              <Text style={styles.notesText}>{catch_.notes}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            {catch_.photos && catch_.photos.length > 0 && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handlePhotoPress(0)}
              >
                <Ionicons name="images" size={16} color={Colors.primary.blue} />
                <Text style={styles.actionButtonText}>Vezi poze</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Photo Viewer Modal */}
      <PhotoViewer
        visible={showPhotoViewer}
        photos={photoMetadata}
        initialIndex={selectedPhotoIndex}
        onClose={() => setShowPhotoViewer(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  catchNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catchNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  catchInfo: {
    flex: 1,
  },
  catchSpecies: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  catchMeasurements: {
    flexDirection: 'row',
    gap: 16,
  },
  measurement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  measurementText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  photoCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  photoCountText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  statusBadge: {
    alignItems: 'center',
  },
  releasedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.secondary.lightGreen + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  releasedText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.secondary.lightGreen,
    textTransform: 'uppercase',
  },
  keptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary.blue + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  keptText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary.blue,
    textTransform: 'uppercase',
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary.blue,
    marginBottom: 12,
  },
  photosSection: {
    marginBottom: 16,
  },
  photosScroll: {
    marginHorizontal: -16,
  },
  photosContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  photoThumbnail: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.light.backgroundSecondary,
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  notesSection: {
    marginBottom: 16,
  },
  notesText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  actionsSection: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.primary.blue + '15',
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary.blue,
  },
})