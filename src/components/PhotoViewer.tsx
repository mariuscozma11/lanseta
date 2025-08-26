import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Image,
  StatusBar,
  PanResponder,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { FishCatch } from '../types/journal'
import { Colors } from '../constants/Colors'

interface PhotoMetadata {
  uri: string
  context: string
  catchInfo?: FishCatch
}

interface PhotoViewerProps {
  visible: boolean
  photos: PhotoMetadata[]
  initialIndex: number
  onClose: () => void
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export default function PhotoViewer({ 
  visible, 
  photos, 
  initialIndex, 
  onClose 
}: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [showControls, setShowControls] = useState(true)
  const scrollViewRef = useRef<any>(null)
  const fadeAnim = useRef(new Animated.Value(1)).current

  // Auto-hide controls after 3 seconds
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null)

  const resetHideTimer = () => {
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current)
    }
    
    if (showControls) {
      hideControlsTimer.current = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowControls(false)
        })
      }, 3000) as unknown as NodeJS.Timeout
    }
  }

  React.useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex)
      setShowControls(true)
      fadeAnim.setValue(1)
      resetHideTimer()
    }
    
    return () => {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current)
      }
    }
  }, [visible, initialIndex, fadeAnim, showControls])

  const toggleControls = () => {
    if (showControls) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowControls(false)
      })
    } else {
      setShowControls(true)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        resetHideTimer()
      })
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      scrollViewRef.current?.scrollTo({ 
        x: (currentIndex - 1) * SCREEN_WIDTH, 
        animated: true 
      })
      resetHideTimer()
    }
  }

  const goToNext = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1)
      scrollViewRef.current?.scrollTo({ 
        x: (currentIndex + 1) * SCREEN_WIDTH, 
        animated: true 
      })
      resetHideTimer()
    }
  }

  const handleScroll = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < photos.length) {
      setCurrentIndex(newIndex)
    }
  }

  if (!visible || photos.length === 0) return null

  const currentPhoto = photos[currentIndex]

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      
      <View style={styles.container}>
        {/* Photos ScrollView */}
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentOffset={{ x: initialIndex * SCREEN_WIDTH, y: 0 }}
        >
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <TouchableOpacity
                style={styles.photoTouchable}
                onPress={toggleControls}
                activeOpacity={1}
              >
                <Image 
                  source={{ uri: photo.uri }} 
                  style={styles.photo}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          ))}
        </Animated.ScrollView>

        {/* Controls Overlay */}
        <Animated.View 
          style={[styles.controlsOverlay, { opacity: fadeAnim }]}
          pointerEvents={showControls ? 'auto' : 'none'}
        >
          {/* Top Bar */}
          <SafeAreaView style={styles.topBar} edges={['top']}>
            <View style={styles.topBarContent}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color={Colors.neutral.white} />
              </TouchableOpacity>
              
              <View style={styles.photoInfo}>
                <Text style={styles.photoCounter}>
                  {currentIndex + 1} din {photos.length}
                </Text>
                <Text style={styles.photoContext}>{currentPhoto?.context}</Text>
              </View>
            </View>
          </SafeAreaView>

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              {currentIndex > 0 && (
                <TouchableOpacity 
                  style={[styles.navButton, styles.navButtonLeft]} 
                  onPress={goToPrevious}
                >
                  <Ionicons name="chevron-back" size={32} color={Colors.neutral.white} />
                </TouchableOpacity>
              )}
              
              {currentIndex < photos.length - 1 && (
                <TouchableOpacity 
                  style={[styles.navButton, styles.navButtonRight]} 
                  onPress={goToNext}
                >
                  <Ionicons name="chevron-forward" size={32} color={Colors.neutral.white} />
                </TouchableOpacity>
              )}
            </>
          )}

          {/* Bottom Info */}
          <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
            <View style={styles.bottomBarContent}>
              {currentPhoto?.catchInfo && (
                <View style={styles.catchInfo}>
                  <View style={styles.catchInfoHeader}>
                    <Ionicons name="fish" size={16} color={Colors.neutral.white} />
                    <Text style={styles.catchSpecies}>
                      {currentPhoto.catchInfo.speciesName}
                    </Text>
                  </View>
                  
                  <Text style={styles.catchDetails}>
                    {currentPhoto.catchInfo.length}cm • {currentPhoto.catchInfo.weight}kg
                    {currentPhoto.catchInfo.released ? ' • Eliberat' : ' • Păstrat'}
                  </Text>
                  
                  {currentPhoto.catchInfo.notes && (
                    <Text style={styles.catchNotes} numberOfLines={2}>
                      {currentPhoto.catchInfo.notes}
                    </Text>
                  )}
                </View>
              )}
              
              {/* Page Indicators */}
              {photos.length > 1 && (
                <View style={styles.pageIndicators}>
                  {photos.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.pageIndicator,
                        index === currentIndex && styles.pageIndicatorActive
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.black,
  },
  scrollView: {
    flex: 1,
  },
  photoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.neutral.black,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoInfo: {
    flex: 1,
    alignItems: 'center',
  },
  photoCounter: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  photoContext: {
    fontSize: 14,
    color: Colors.neutral.white + 'CC',
    marginTop: 2,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -25 }],
  },
  navButtonLeft: {
    left: 20,
  },
  navButtonRight: {
    right: 20,
  },
  bottomBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  bottomBarContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  catchInfo: {
    marginBottom: 16,
  },
  catchInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  catchSpecies: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  catchDetails: {
    fontSize: 14,
    color: Colors.neutral.white + 'CC',
    marginBottom: 8,
  },
  catchNotes: {
    fontSize: 13,
    color: Colors.neutral.white + 'AA',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neutral.white + '40',
  },
  pageIndicatorActive: {
    backgroundColor: Colors.neutral.white,
  },
})