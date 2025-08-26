import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '../constants/Colors'
import { SolunarData } from '../utils/solunarUtils'

interface SolunarCardProps {
  data: SolunarData
  compact?: boolean
}

export default function SolunarCard({ data, compact = false }: SolunarCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return Colors.secondary.lightGreen
    if (score >= 60) return Colors.accent.gold
    if (score >= 40) return Colors.accent.orange
    return Colors.light.textSecondary
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelent'
    if (score >= 60) return 'Bun'
    if (score >= 40) return 'Moderat'
    return 'Slab'
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ro-RO', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  if (compact) {
    return (
      <View style={styles.compactCard}>
        <View style={styles.compactHeader}>
          <Text style={styles.moonEmoji}>{data.moonPhase.emoji}</Text>
          <View style={styles.compactScoreContainer}>
            <Text style={[styles.compactScore, { color: getScoreColor(data.dailyScore) }]}>
              {data.dailyScore}
            </Text>
            <Text style={styles.compactLabel}>Solunar</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Activitate Solunar</Text>
          <Text style={styles.date}>
            {data.date.toLocaleDateString('ro-RO', { 
              day: 'numeric', 
              month: 'long' 
            })}
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={[styles.dailyScore, { color: getScoreColor(data.dailyScore) }]}>
            {data.dailyScore}
          </Text>
          <Text style={[styles.scoreLabel, { color: getScoreColor(data.dailyScore) }]}>
            {getScoreLabel(data.dailyScore)}
          </Text>
        </View>
      </View>

      <View style={styles.moonSection}>
        <View style={styles.moonInfo}>
          <Text style={styles.moonEmoji}>{data.moonPhase.emoji}</Text>
          <View>
            <Text style={styles.moonPhase}>{data.moonPhase.phaseName}</Text>
            <Text style={styles.moonDetails}>
              Iluminare: {data.moonPhase.illumination}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sunSection}>
        <View style={styles.sunTimes}>
          <View style={styles.sunTime}>
            <Text style={styles.sunIcon}>🌅</Text>
            <Text style={styles.sunLabel}>Răsărit</Text>
            <Text style={styles.timeText}>{formatTime(data.sunTimes.sunrise)}</Text>
          </View>
          <View style={styles.sunTime}>
            <Text style={styles.sunIcon}>🌇</Text>
            <Text style={styles.sunLabel}>Apus</Text>
            <Text style={styles.timeText}>{formatTime(data.sunTimes.sunset)}</Text>
          </View>
        </View>
      </View>

      {data.bestTimes.length > 0 && (
        <View style={styles.bestTimesSection}>
          <Text style={styles.bestTimesTitle}>⭐ Cele mai bune ore:</Text>
          <View style={styles.bestTimes}>
            {data.bestTimes.map((time, index) => (
              <View key={index} style={styles.bestTime}>
                <Text style={styles.bestTimeHour}>
                  {time.hour.toString().padStart(2, '0')}:00
                </Text>
                <View style={[
                  styles.bestTimeScore,
                  { backgroundColor: getScoreColor(time.score) }
                ]}>
                  <Text style={styles.bestTimeScoreText}>{time.score}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  compactCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary.blue,
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  compactScoreContainer: {
    alignItems: 'center',
  },
  dailyScore: {
    fontSize: 28,
    fontWeight: '800',
  },
  compactScore: {
    fontSize: 20,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  compactLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  moonSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
    paddingTop: 16,
    marginBottom: 16,
  },
  moonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moonEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  moonPhase: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  moonDetails: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  sunSection: {
    marginBottom: 16,
  },
  sunTimes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sunTime: {
    alignItems: 'center',
  },
  sunIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  sunLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  bestTimesSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
    paddingTop: 16,
  },
  bestTimesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary.blue,
    marginBottom: 12,
  },
  bestTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  bestTime: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bestTimeHour: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  bestTimeScore: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  bestTimeScoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
})