import React from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FishingSession } from '../types/journal'
import { 
  calculateJournalStats, 
  getMonthlyStats, 
  getSpeciesStats, 
  getLocationStats,
  getTechniqueStats 
} from '../utils/journalStats'
import { Colors } from '../constants/Colors'

interface JournalStatsProps {
  sessions: FishingSession[]
}

const { width } = Dimensions.get('window')

export default function JournalStats({ sessions }: JournalStatsProps) {
  const stats = calculateJournalStats(sessions)
  const monthlyStats = getMonthlyStats(sessions)
  const speciesStats = getSpeciesStats(sessions)
  const locationStats = getLocationStats(sessions)
  const techniqueStats = getTechniqueStats(sessions)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date))
  }

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    subtitle, 
    color = Colors.primary.blue,
    size = 'normal'
  }: {
    icon: string
    title: string
    value: string
    subtitle?: string
    color?: string
    size?: 'normal' | 'large'
  }) => (
    <View style={[
      styles.statCard,
      size === 'large' && styles.largeStatCard
    ]}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={size === 'large' ? 28 : 20} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={[
          styles.statValue,
          size === 'large' && styles.largeStatValue
        ]}>
          {value}
        </Text>
        <Text style={[
          styles.statTitle,
          size === 'large' && styles.largeStatTitle
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.statSubtitle}>{subtitle}</Text>
        )}
      </View>
    </View>
  )

  const ChartBar = ({ 
    label, 
    value, 
    maxValue, 
    color = Colors.primary.blue,
    showValue = true 
  }: {
    label: string
    value: number
    maxValue: number
    color?: string
    showValue?: boolean
  }) => (
    <View style={styles.chartBarContainer}>
      <Text style={styles.chartLabel}>{label}</Text>
      <View style={styles.chartBarTrack}>
        <View 
          style={[
            styles.chartBarFill,
            { 
              width: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%`,
              backgroundColor: color 
            }
          ]} 
        />
      </View>
      {showValue && <Text style={styles.chartValue}>{value}</Text>}
    </View>
  )

  if (sessions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="analytics" size={64} color={Colors.light.textSecondary} />
        <Text style={styles.emptyTitle}>Statistici Pescuit</Text>
        <Text style={styles.emptySubtitle}>
          Adaugă sesiuni de pescuit pentru a vedea statisticile tale
        </Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Overview Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prezentare Generală</Text>
        
        <View style={styles.statsRow}>
          <StatCard
            icon="calendar"
            title="Sesiuni"
            value={stats.totalSessions.toString()}
            color={Colors.primary.blue}
          />
          <StatCard
            icon="fish"
            title="Capturi"
            value={stats.totalCatches.toString()}
            subtitle={`${stats.averageCatchesPerSession.toFixed(1)}/sesiune`}
            color={Colors.secondary.lightGreen}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon="scale"
            title="Greutate Totală"
            value={`${stats.totalWeight.toFixed(1)} kg`}
            color={Colors.warning.orange}
          />
          <StatCard
            icon="time"
            title="Ore Pescuit"
            value={`${stats.totalHours.toFixed(1)} h`}
            color={Colors.accent.gold}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon="library"
            title="Specii"
            value={stats.speciesCount.toString()}
            subtitle="Unice prinse"
            color={Colors.primary.lightBlue}
          />
          <StatCard
            icon="checkmark-circle"
            title="Rata Succes"
            value={`${stats.successRate.toFixed(0)}%`}
            subtitle="Sesiuni cu capturi"
            color={Colors.secondary.lightGreen}
          />
        </View>
      </View>

      {/* Best Records */}
      {stats.largestCatch.weight > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recorduri</Text>
          
          <View style={[styles.recordCard, styles.largestCatchCard]}>
            <View style={styles.recordIcon}>
              <Ionicons name="trophy" size={32} color={Colors.accent.gold} />
            </View>
            <View style={styles.recordContent}>
              <Text style={styles.recordTitle}>Cea mai mare captură</Text>
              <Text style={styles.recordSpecies}>{stats.largestCatch.species}</Text>
              <Text style={styles.recordDetails}>
                {stats.largestCatch.length}cm • {stats.largestCatch.weight}kg
              </Text>
              <Text style={styles.recordDate}>
                {formatDate(stats.largestCatch.date)}
              </Text>
            </View>
          </View>

          <View style={styles.recordsRow}>
            <View style={styles.recordCard}>
              <Ionicons name="location" size={20} color={Colors.primary.blue} />
              <Text style={styles.recordLabel}>Locația Favorită</Text>
              <Text style={styles.recordValue}>{stats.favoriteLocation}</Text>
            </View>
            
            <View style={styles.recordCard}>
              <Ionicons name="fish" size={20} color={Colors.secondary.lightGreen} />
              <Text style={styles.recordLabel}>Specia Favorită</Text>
              <Text style={styles.recordValue}>{stats.favoriteSpecies}</Text>
            </View>
          </View>

          {stats.bestMonth && (
            <View style={styles.recordCard}>
              <Ionicons name="calendar" size={20} color={Colors.warning.orange} />
              <Text style={styles.recordLabel}>Cea mai bună lună</Text>
              <Text style={styles.recordValue}>{stats.bestMonth}</Text>
            </View>
          )}
        </View>
      )}

      {/* Monthly Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activitate Lunară</Text>
        <View style={styles.chartContainer}>
          {monthlyStats.map((month, index) => {
            const maxCatches = Math.max(...monthlyStats.map(m => m.catches))
            return (
              <ChartBar
                key={index}
                label={month.month}
                value={month.catches}
                maxValue={maxCatches}
                color={Colors.secondary.lightGreen}
              />
            )
          })}
        </View>
      </View>

      {/* Species Performance */}
      {speciesStats.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performanță pe Specii</Text>
          <View style={styles.chartContainer}>
            {speciesStats.slice(0, 6).map((species, index) => {
              const maxCount = Math.max(...speciesStats.map(s => s.count))
              return (
                <View key={index} style={styles.speciesRow}>
                  <ChartBar
                    label={species.species}
                    value={species.count}
                    maxValue={maxCount}
                    color={Colors.primary.blue}
                  />
                  <Text style={styles.speciesWeight}>
                    {species.weight.toFixed(1)}kg
                  </Text>
                </View>
              )
            })}
          </View>
        </View>
      )}

      {/* Location Performance */}
      {locationStats.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performanță pe Locații</Text>
          <View style={styles.chartContainer}>
            {locationStats.slice(0, 5).map((location, index) => {
              const maxCatches = Math.max(...locationStats.map(l => l.catches))
              return (
                <View key={index} style={styles.locationRow}>
                  <ChartBar
                    label={location.location}
                    value={location.catches}
                    maxValue={maxCatches}
                    color={Colors.warning.orange}
                  />
                  <Text style={styles.locationSuccess}>
                    {location.successRate.toFixed(0)}%
                  </Text>
                </View>
              )
            })}
          </View>
        </View>
      )}

      {/* Technique Effectiveness */}
      {techniqueStats.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eficacitatea Tehnicilor</Text>
          <View style={styles.chartContainer}>
            {techniqueStats.slice(0, 6).map((technique, index) => {
              const maxAvg = Math.max(...techniqueStats.map(t => t.avgCatchesPerSession))
              return (
                <View key={index} style={styles.techniqueRow}>
                  <ChartBar
                    label={technique.technique}
                    value={technique.avgCatchesPerSession}
                    maxValue={maxAvg}
                    color={Colors.accent.orange}
                    showValue={false}
                  />
                  <Text style={styles.techniqueAvg}>
                    {technique.avgCatchesPerSession.toFixed(1)}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  section: {
    backgroundColor: Colors.neutral.white,
    marginHorizontal: 16,
    marginBottom: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary.blue,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  largeStatCard: {
    padding: 16,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  largeStatValue: {
    fontSize: 24,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
  },
  largeStatTitle: {
    fontSize: 14,
  },
  statSubtitle: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  largestCatchCard: {
    backgroundColor: Colors.accent.gold + '10',
    borderWidth: 1,
    borderColor: Colors.accent.gold + '30',
  },
  recordIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent.gold + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordContent: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
  },
  recordSpecies: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginVertical: 2,
  },
  recordDetails: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.accent.gold,
  },
  recordDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  recordsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  recordLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  recordValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  chartContainer: {
    gap: 8,
  },
  chartBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    width: 60,
  },
  chartBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.light.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  chartValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    width: 30,
    textAlign: 'right',
  },
  speciesRow: {
    gap: 4,
  },
  speciesWeight: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    textAlign: 'right',
    marginTop: 2,
  },
  locationRow: {
    gap: 4,
  },
  locationSuccess: {
    fontSize: 10,
    color: Colors.secondary.lightGreen,
    textAlign: 'right',
    fontWeight: '600',
    marginTop: 2,
  },
  techniqueRow: {
    gap: 4,
  },
  techniqueAvg: {
    fontSize: 10,
    color: Colors.accent.orange,
    textAlign: 'right',
    fontWeight: '600',
    marginTop: 2,
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
  },
})