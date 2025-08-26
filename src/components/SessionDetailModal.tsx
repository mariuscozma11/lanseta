import React, { useRef, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { FishingSession, JournalEntry } from '../types/journal'
import SessionPhotoGallery from './SessionPhotoGallery'
import CatchDetailItem from './CatchDetailItem'
import { Colors } from '../constants/Colors'

interface SessionDetailModalProps {
  visible: boolean
  session: FishingSession | null
  onClose: () => void
  onEdit?: () => void
  onShare?: () => void
  onDelete?: (session: FishingSession) => void
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.9

export default function SessionDetailModal({
  visible,
  session,
  onClose,
  onEdit,
  onShare,
  onDelete
}: SessionDetailModalProps) {
  const translateY = useSharedValue(0)
  const gestureHandler = useRef<PanGestureHandler>(null)

  // Reset animation values when modal opens
  useEffect(() => {
    if (visible) {
      translateY.value = 0
    }
  }, [visible, translateY])

  const panGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (_, context: any) => {
      context.startY = translateY.value
    },
    onActive: (event, context: any) => {
      translateY.value = Math.max(0, context.startY + event.translationY)
    },
    onEnd: (event) => {
      const shouldClose = event.translationY > 100 || event.velocityY > 500
      if (shouldClose) {
        runOnJS(onClose)()
      } else {
        translateY.value = 0
      }
    },
  })

  const modalAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, MODAL_HEIGHT / 2],
      [1, 0],
      Extrapolate.CLAMP
    )

    return {
      transform: [{ translateY: translateY.value }],
      opacity,
    }
  })

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, MODAL_HEIGHT / 2],
      [0.5, 0],
      Extrapolate.CLAMP
    )

    return {
      opacity,
    }
  })

  if (!session) return null

  const handleDeleteSession = () => {
    Alert.alert(
      'Șterge Sesiunea',
      `Ești sigur că vrei să ștergi sesiunea din ${session.location.name}?\n\nCapturi: ${session.catches.length}\nData: ${formatDate(session.date)}\n\nAceastă acțiune nu poate fi anulată.`,
      [
        {
          text: 'Anulează',
          style: 'cancel'
        },
        {
          text: 'Șterge',
          style: 'destructive',
          onPress: () => {
            if (onDelete) {
              onDelete(session)
              onClose()
            }
          }
        }
      ]
    )
  }

  // Transform session to journal entry for computed fields
  const startTime = new Date(`1970-01-01T${session.startTime}:00`)
  const endTime = new Date(`1970-01-01T${session.endTime}:00`)
  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60)

  const journalEntry: JournalEntry = {
    ...session,
    duration,
    catchCount: session.catches.length,
    totalWeight: session.catches.reduce((sum, catch_) => sum + catch_.weight, 0),
    biggestCatch: session.catches.length > 0 
      ? session.catches.reduce((max, catch_) => catch_.weight > max.weight ? catch_ : max)
      : undefined,
    speciesVariety: new Set(session.catches.map(c => c.speciesId)).size
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ro-RO', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(date))
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const getWeatherIcon = (conditions: string) => {
    switch (conditions) {
      case 'Senin': return 'sunny'
      case 'Parțial noros': return 'partly-sunny'
      case 'Noros': return 'cloudy'
      case 'Ploios': return 'rainy'
      case 'Furtună': return 'thunderstorm'
      default: return 'partly-sunny'
    }
  }

  const allPhotos = [
    ...session.photos,
    ...session.catches.flatMap(catch_ => catch_.photos || [])
  ]

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />
        
        <PanGestureHandler
          ref={gestureHandler}
          onGestureEvent={panGestureEvent}
        >
          <Animated.View style={[styles.modal, modalAnimatedStyle]}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
              {/* Handle Bar */}
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>

              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Text style={styles.dateTitle}>{formatDate(session.date)}</Text>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>
                      {session.startTime} - {session.endTime}
                    </Text>
                    <Text style={styles.durationText}>({formatDuration(duration)})</Text>
                  </View>
                </View>
                
                <View style={styles.headerRight}>
                  <Text style={styles.ratingStars}>{getRatingStars(session.rating)}</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color={Colors.light.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView 
                style={styles.content} 
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {/* Location */}
                <View style={styles.locationSection}>
                  <View style={styles.locationHeader}>
                    <Ionicons name="location" size={20} color={Colors.primary.blue} />
                    <Text style={styles.locationName}>{session.location.name}</Text>
                    <View style={styles.locationBadge}>
                      <Text style={styles.locationBadgeText}>{session.location.waterBody}</Text>
                    </View>
                  </View>
                </View>

                {/* Photos Gallery */}
                {allPhotos.length > 0 && (
                  <SessionPhotoGallery 
                    photos={allPhotos}
                    catches={session.catches}
                  />
                )}

                {/* Session Stats */}
                <View style={styles.statsSection}>
                  <Text style={styles.sectionTitle}>Statistici Sesiune</Text>
                  
                  <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                      <Ionicons name="fish" size={24} color={Colors.secondary.lightGreen} />
                      <Text style={styles.statValue}>{journalEntry.catchCount}</Text>
                      <Text style={styles.statLabel}>Capturi</Text>
                    </View>

                    {journalEntry.totalWeight > 0 && (
                      <View style={styles.statCard}>
                        <Ionicons name="scale" size={24} color={Colors.warning.orange} />
                        <Text style={styles.statValue}>{journalEntry.totalWeight.toFixed(1)} kg</Text>
                        <Text style={styles.statLabel}>Greutate</Text>
                      </View>
                    )}

                    {journalEntry.speciesVariety > 0 && (
                      <View style={styles.statCard}>
                        <Ionicons name="library" size={24} color={Colors.primary.lightBlue} />
                        <Text style={styles.statValue}>{journalEntry.speciesVariety}</Text>
                        <Text style={styles.statLabel}>Specii</Text>
                      </View>
                    )}

                    {journalEntry.biggestCatch && (
                      <View style={styles.statCard}>
                        <Ionicons name="trophy" size={24} color={Colors.accent.gold} />
                        <Text style={styles.statValue}>{journalEntry.biggestCatch.weight} kg</Text>
                        <Text style={styles.statLabel}>Cea mai mare</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Weather Conditions */}
                <View style={styles.weatherSection}>
                  <Text style={styles.sectionTitle}>Condiții Météo</Text>
                  
                  <View style={styles.weatherCard}>
                    <View style={styles.weatherMain}>
                      <Ionicons 
                        name={getWeatherIcon(session.weather.conditions) as any} 
                        size={32} 
                        color={Colors.accent.orange} 
                      />
                      <View style={styles.weatherInfo}>
                        <Text style={styles.temperature}>{session.weather.temperature}°C</Text>
                        <Text style={styles.conditions}>{session.weather.conditions}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.weatherDetails}>
                      <View style={styles.weatherDetail}>
                        <Ionicons name="water" size={16} color={Colors.primary.blue} />
                        <Text style={styles.weatherDetailText}>Umiditate: {session.weather.humidity}%</Text>
                      </View>
                      
                      <View style={styles.weatherDetail}>
                        <Ionicons name="speedometer" size={16} color={Colors.primary.blue} />
                        <Text style={styles.weatherDetailText}>Presiune: {session.weather.pressure} mb</Text>
                      </View>
                      
                      <View style={styles.weatherDetail}>
                        <Ionicons name="flag" size={16} color={Colors.primary.blue} />
                        <Text style={styles.weatherDetailText}>
                          Vânt: {session.weather.windSpeed} km/h {session.weather.windDirection}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Techniques and Baits */}
                <View style={styles.methodsSection}>
                  <Text style={styles.sectionTitle}>Metode și Momeli</Text>
                  
                  <View style={styles.methodsContent}>
                    <View style={styles.methodItem}>
                      <Ionicons name="construct" size={16} color={Colors.primary.blue} />
                      <Text style={styles.methodLabel}>Tehnici:</Text>
                      <Text style={styles.methodText}>{session.techniques.join(', ')}</Text>
                    </View>
                    
                    <View style={styles.methodItem}>
                      <Ionicons name="nutrition" size={16} color={Colors.secondary.lightGreen} />
                      <Text style={styles.methodLabel}>Momeală:</Text>
                      <Text style={styles.methodText}>{session.baits.join(', ')}</Text>
                    </View>
                  </View>
                </View>

                {/* Catches Detail */}
                {session.catches.length > 0 && (
                  <View style={styles.catchesSection}>
                    <Text style={styles.sectionTitle}>
                      Capturi Detaliate ({session.catches.length})
                    </Text>
                    
                    {session.catches.map((catch_, index) => (
                      <CatchDetailItem 
                        key={catch_.id}
                        catch_={catch_}
                        index={index}
                      />
                    ))}
                  </View>
                )}

                {/* Session Notes */}
                {session.notes && (
                  <View style={styles.notesSection}>
                    <Text style={styles.sectionTitle}>Notițe</Text>
                    <Text style={styles.notesText}>{session.notes}</Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionsSection}>
                  <View style={styles.primaryActions}>
                    {onShare && (
                      <TouchableOpacity style={styles.shareButton} onPress={onShare}>
                        <Ionicons name="share" size={20} color={Colors.primary.blue} />
                        <Text style={styles.shareButtonText}>Distribuie</Text>
                      </TouchableOpacity>
                    )}
                    
                    {onEdit && (
                      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                        <Ionicons name="create" size={20} color={Colors.secondary.lightGreen} />
                        <Text style={styles.editButtonText}>Editează</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {onDelete && (
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSession}>
                      <Ionicons name="trash" size={20} color={Colors.error.red} />
                      <Text style={styles.deleteButtonText}>Șterge Sesiunea</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </SafeAreaView>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.neutral.black,
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: MODAL_HEIGHT,
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  safeArea: {
    flex: 1,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.light.borderLight,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  headerLeft: {
    flex: 1,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    color: Colors.primary.blue,
    fontWeight: '600',
  },
  durationText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  ratingStars: {
    fontSize: 18,
    color: Colors.accent.gold,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  locationSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary.blue,
    flex: 1,
  },
  locationBadge: {
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  locationBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary.blue,
    marginBottom: 16,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginTop: 4,
  },
  weatherSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  weatherCard: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  weatherInfo: {
    flex: 1,
  },
  temperature: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
  },
  conditions: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  weatherDetails: {
    gap: 8,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weatherDetailText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  methodsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  methodsContent: {
    gap: 12,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    minWidth: 60,
  },
  methodText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  catchesSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  notesSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  notesText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  primaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary.blue,
    backgroundColor: Colors.primary.blue + '10',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.blue,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.secondary.lightGreen,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error.red,
    backgroundColor: Colors.error.red + '10',
    marginTop: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error.red,
  },
})