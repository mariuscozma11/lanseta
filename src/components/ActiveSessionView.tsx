import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ActiveSession, FishCatch } from '../types/journal'
import { Colors } from '../constants/Colors'

interface ActiveSessionViewProps {
  session: ActiveSession
  onAddCatch: () => void
  onEndSession: () => void
  onUpdateSession: (session: ActiveSession) => void
}

export default function ActiveSessionView({ 
  session, 
  onAddCatch, 
  onEndSession, 
  onUpdateSession 
}: ActiveSessionViewProps) {
  const [sessionDuration, setSessionDuration] = useState('')

  useEffect(() => {
    const updateDuration = () => {
      const now = new Date()
      const start = new Date(session.startDate)
      const diffMs = now.getTime() - start.getTime()
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      
      if (hours > 0) {
        setSessionDuration(`${hours}h ${minutes}m`)
      } else {
        setSessionDuration(`${minutes}m`)
      }
    }

    updateDuration()
    const interval = setInterval(updateDuration, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [session.startDate])

  const handleEndSession = () => {
    Alert.alert(
      'Finalizează Sesiunea',
      `Vrei să finalizezi sesiunea de pescuit?\n\nCapturi: ${session.catches.length}\nDurată: ${sessionDuration}`,
      [
        { text: 'Anulează', style: 'cancel' },
        { text: 'Finalizează', style: 'destructive', onPress: onEndSession }
      ]
    )
  }

  const totalWeight = session.catches.reduce((sum, catch_) => sum + catch_.weight, 0)
  const biggestCatch = session.catches.length > 0 
    ? session.catches.reduce((max, catch_) => catch_.weight > max.weight ? catch_ : max)
    : null

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

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date)
  }

  const renderCatch = (catch_: FishCatch, index: number) => (
    <View key={catch_.id} style={styles.catchItem}>
      <View style={styles.catchHeader}>
        <View style={styles.catchNumber}>
          <Text style={styles.catchNumberText}>#{index + 1}</Text>
        </View>
        <View style={styles.catchInfo}>
          <Text style={styles.catchSpecies}>{catch_.speciesName}</Text>
          <Text style={styles.catchDetails}>
            {catch_.length}cm • {catch_.weight}kg
          </Text>
        </View>
        <View style={styles.catchStatus}>
          {catch_.released ? (
            <View style={styles.releasedBadge}>
              <Ionicons name="leaf" size={14} color={Colors.secondary.lightGreen} />
              <Text style={styles.releasedText}>Eliberat</Text>
            </View>
          ) : (
            <View style={styles.keptBadge}>
              <Ionicons name="fish" size={14} color={Colors.primary.blue} />
              <Text style={styles.keptText}>Păstrat</Text>
            </View>
          )}
        </View>
      </View>
      
      {catch_.photos && catch_.photos.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.photosContainer}
          contentContainerStyle={styles.photosContent}
        >
          {catch_.photos.map((photo, photoIndex) => (
            <Image 
              key={photoIndex} 
              source={{ uri: photo }} 
              style={styles.catchPhoto} 
            />
          ))}
        </ScrollView>
      )}
      
      {catch_.notes && (
        <Text style={styles.catchNotes}>{catch_.notes}</Text>
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Active Session Header */}
      <View style={styles.activeHeader}>
        <View style={styles.statusIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Sesiune Activă</Text>
        </View>
        
        <TouchableOpacity style={styles.endButton} onPress={handleEndSession}>
          <Ionicons name="stop" size={16} color={Colors.neutral.white} />
          <Text style={styles.endButtonText}>Finalizează</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Session Info */}
        <View style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <View style={styles.locationInfo}>
              <Ionicons name="location" size={20} color={Colors.primary.blue} />
              <View style={styles.locationText}>
                <Text style={styles.locationName}>{session.location.name}</Text>
                <Text style={styles.locationType}>{session.location.waterBody}</Text>
              </View>
            </View>
            
            <View style={styles.timeInfo}>
              <Text style={styles.startTime}>{session.startTime}</Text>
              <Text style={styles.duration}>{sessionDuration}</Text>
            </View>
          </View>

          <View style={styles.weatherRow}>
            <View style={styles.weatherItem}>
              <Ionicons 
                name={getWeatherIcon(session.weather.conditions) as any} 
                size={18} 
                color={Colors.accent.orange} 
              />
              <Text style={styles.weatherText}>
                {session.weather.temperature}°C • {session.weather.conditions}
              </Text>
            </View>
            
            <View style={styles.weatherItem}>
              <Ionicons name="flag" size={16} color={Colors.light.textSecondary} />
              <Text style={styles.weatherText}>
                Vânt {session.weather.windSpeed} km/h {session.weather.windDirection}
              </Text>
            </View>
          </View>

          <View style={styles.techniquesRow}>
            <Text style={styles.techniquesLabel}>Tehnici:</Text>
            <Text style={styles.techniquesText}>
              {session.techniques.slice(0, 2).join(', ')}
              {session.techniques.length > 2 && ` +${session.techniques.length - 2} mai multe`}
            </Text>
          </View>
        </View>

        {/* Session Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="fish" size={20} color={Colors.secondary.lightGreen} />
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{session.catches.length}</Text>
              <Text style={styles.statLabel}>Capturi</Text>
            </View>
          </View>

          {totalWeight > 0 && (
            <View style={styles.statItem}>
              <Ionicons name="scale" size={20} color={Colors.warning.orange} />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{totalWeight.toFixed(1)} kg</Text>
                <Text style={styles.statLabel}>Greutate</Text>
              </View>
            </View>
          )}

          {biggestCatch && (
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={20} color={Colors.accent.gold} />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{biggestCatch.weight} kg</Text>
                <Text style={styles.statLabel}>Cea mai mare</Text>
              </View>
            </View>
          )}
        </View>

        {/* Add Catch Button */}
        <TouchableOpacity style={styles.addCatchButton} onPress={onAddCatch}>
          <View style={styles.addCatchIcon}>
            <Ionicons name="add" size={24} color={Colors.neutral.white} />
          </View>
          <View style={styles.addCatchContent}>
            <Text style={styles.addCatchTitle}>Adaugă Captură</Text>
            <Text style={styles.addCatchSubtitle}>Înregistrează un pește prins</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.primary.blue} />
        </TouchableOpacity>

        {/* Photo Gallery */}
        {session.catches.some(catch_ => catch_.photos && catch_.photos.length > 0) && (
          <View style={styles.gallerySection}>
            <Text style={styles.gallerySectionTitle}>
              Galeria Sesiunii ({session.catches.reduce((total, catch_) => total + (catch_.photos?.length || 0), 0)} poze)
            </Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.galleryContainer}
              contentContainerStyle={styles.galleryContent}
            >
              {session.catches.map((catch_, catchIndex) => 
                catch_.photos?.map((photo, photoIndex) => (
                  <View key={`${catchIndex}-${photoIndex}`} style={styles.galleryPhotoContainer}>
                    <Image source={{ uri: photo }} style={styles.galleryPhoto} />
                    <Text style={styles.galleryPhotoLabel}>#{catchIndex + 1}</Text>
                  </View>
                ))
              ).flat().filter(Boolean)}
            </ScrollView>
          </View>
        )}

        {/* Catches List */}
        {session.catches.length > 0 && (
          <View style={styles.catchesSection}>
            <Text style={styles.catchesSectionTitle}>
              Capturi ({session.catches.length})
            </Text>
            
            {session.catches.map((catch_, index) => renderCatch(catch_, index))}
          </View>
        )}

        {session.catches.length === 0 && (
          <View style={styles.noCatchesContainer}>
            <Ionicons name="fish-outline" size={48} color={Colors.light.textSecondary} />
            <Text style={styles.noCatchesTitle}>Nicio captură încă</Text>
            <Text style={styles.noCatchesSubtitle}>
              Apasă "Adaugă Captură" când prinzi primul pește
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.secondary.lightGreen,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neutral.white,
  },
  liveText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  endButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.error.red,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  endButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  content: {
    flex: 1,
  },
  sessionCard: {
    backgroundColor: Colors.neutral.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  locationText: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  locationType: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  startTime: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.blue,
  },
  duration: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  weatherRow: {
    gap: 8,
    marginBottom: 12,
  },
  weatherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weatherText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  techniquesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  techniquesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  techniquesText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  addCatchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 2,
    borderColor: Colors.secondary.lightGreen,
    borderStyle: 'dashed',
  },
  addCatchIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondary.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addCatchContent: {
    flex: 1,
  },
  addCatchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.secondary.lightGreen,
  },
  addCatchSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  catchesSection: {
    backgroundColor: Colors.neutral.white,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  catchesSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.blue,
    marginBottom: 16,
  },
  catchItem: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  catchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  catchNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  },
  catchDetails: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  catchStatus: {
    alignItems: 'flex-end',
  },
  releasedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.secondary.lightGreen + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  releasedText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary.lightGreen,
    textTransform: 'uppercase',
  },
  keptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary.blue + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  keptText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary.blue,
    textTransform: 'uppercase',
  },
  catchNotes: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
    marginLeft: 44,
  },
  noCatchesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noCatchesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 12,
    marginBottom: 4,
  },
  noCatchesSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  photosContainer: {
    marginTop: 12,
    marginBottom: 4,
  },
  photosContent: {
    paddingHorizontal: 44,
    gap: 8,
  },
  catchPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  gallerySection: {
    backgroundColor: Colors.neutral.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  gallerySectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.blue,
    marginBottom: 16,
  },
  galleryContainer: {
    marginHorizontal: -16,
  },
  galleryContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  galleryPhotoContainer: {
    alignItems: 'center',
  },
  galleryPhoto: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  galleryPhotoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
})