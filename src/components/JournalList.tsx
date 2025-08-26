import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FishingSession, JournalEntry } from '../types/journal'
import { Colors } from '../constants/Colors'

interface JournalListProps {
  sessions: FishingSession[]
  onSessionPress: (session: FishingSession) => void
  onAddPress: () => void
}

export default function JournalList({ sessions, onSessionPress, onAddPress }: JournalListProps) {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])

  useEffect(() => {
    // Transform sessions into journal entries with computed fields
    const entries: JournalEntry[] = sessions.map(session => {
      const startTime = new Date(`1970-01-01T${session.startTime}:00`)
      const endTime = new Date(`1970-01-01T${session.endTime}:00`)
      const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60)

      const catchCount = session.catches.length
      const totalWeight = session.catches.reduce((sum, catch_) => sum + catch_.weight, 0)
      const biggestCatch = session.catches.length > 0 
        ? session.catches.reduce((max, catch_) => catch_.weight > max.weight ? catch_ : max)
        : undefined

      const uniqueSpecies = new Set(session.catches.map(c => c.speciesId))
      const speciesVariety = uniqueSpecies.size

      return {
        ...session,
        duration,
        catchCount,
        totalWeight,
        biggestCatch,
        speciesVariety
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setJournalEntries(entries)
  }, [sessions])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ro-RO', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
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


  const renderJournalItem = ({ item }: { item: JournalEntry }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.sessionCard}
        onPress={() => onSessionPress(item)}
        activeOpacity={0.7}
      >
      <View style={styles.cardHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
          <Text style={styles.timeText}>
            {item.startTime} - {item.endTime} ({formatDuration(item.duration)})
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingStars}>{getRatingStars(item.rating)}</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.textSecondary} />
        </View>
      </View>

      <View style={styles.locationContainer}>
        <Ionicons name="location" size={16} color={Colors.primary.blue} />
        <Text style={styles.locationText}>{item.location.name}</Text>
        <View style={styles.locationBadge}>
          <Text style={styles.locationBadgeText}>{item.location.waterBody}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="fish" size={16} color={Colors.secondary.lightGreen} />
          <Text style={styles.statText}>{item.catchCount} capturi</Text>
        </View>
        
        {item.totalWeight > 0 && (
          <View style={styles.statItem}>
            <Ionicons name="scale" size={16} color={Colors.warning.orange} />
            <Text style={styles.statText}>{item.totalWeight.toFixed(1)} kg</Text>
          </View>
        )}

        {item.speciesVariety > 0 && (
          <View style={styles.statItem}>
            <Ionicons name="library" size={16} color={Colors.primary.lightBlue} />
            <Text style={styles.statText}>{item.speciesVariety} specii</Text>
          </View>
        )}

        <View style={styles.weatherItem}>
          <Ionicons 
            name={getWeatherIcon(item.weather.conditions) as any} 
            size={16} 
            color={Colors.accent.orange} 
          />
          <Text style={styles.statText}>{item.weather.temperature}°C</Text>
        </View>
      </View>

      {item.biggestCatch && (
        <View style={styles.biggestCatchContainer}>
          <Ionicons name="trophy" size={14} color={Colors.accent.gold} />
          <Text style={styles.biggestCatchText}>
            {item.biggestCatch.speciesName}: {item.biggestCatch.length}cm, {item.biggestCatch.weight}kg
          </Text>
        </View>
      )}

      {item.catchCount === 0 && (
        <View style={styles.noCatchContainer}>
          <Ionicons name="remove-circle" size={14} color={Colors.light.textSecondary} />
          <Text style={styles.noCatchText}>Fără capturi</Text>
        </View>
      )}

      {item.notes && (
        <Text style={styles.notesPreview} numberOfLines={2}>
          {item.notes}
        </Text>
      )}
      </TouchableOpacity>
    </View>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="journal" size={64} color={Colors.light.textSecondary} />
      <Text style={styles.emptyTitle}>Jurnalul tău de pescuit</Text>
      <Text style={styles.emptySubtitle}>
        Începe să înregistrezi sesiunile de pescuit pentru a-ți urmări progresul
      </Text>
      <TouchableOpacity style={styles.startButton} onPress={onAddPress}>
        <Ionicons name="add-circle" size={20} color={Colors.neutral.white} />
        <Text style={styles.startButtonText}>Prima sesiune</Text>
      </TouchableOpacity>
    </View>
  )

  if (journalEntries.length === 0) {
    return renderEmptyState()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.totalSessions}>{journalEntries.length} sesiuni</Text>
          <Text style={styles.totalCatches}>
            {journalEntries.reduce((sum, entry) => sum + entry.catchCount, 0)} capturi totale
          </Text>
        </View>
        
        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <Ionicons name="add" size={24} color={Colors.neutral.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={journalEntries}
        renderItem={renderJournalItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  headerLeft: {
    flex: 1,
  },
  totalSessions: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  totalCatches: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  sessionCard: {
    backgroundColor: Colors.neutral.white,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  timeText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingStars: {
    fontSize: 16,
    color: Colors.accent.gold,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.blue,
    flex: 1,
  },
  locationBadge: {
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  locationBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  weatherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  biggestCatchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accent.gold + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  biggestCatchText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accent.gold,
  },
  noCatchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  noCatchText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.light.textSecondary,
  },
  notesPreview: {
    fontSize: 13,
    color: Colors.light.text,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary.blue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
})