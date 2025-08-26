import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Colors } from '../constants/Colors'
import { SolunarData } from '../utils/solunarUtils'

interface HourlyActivityChartProps {
  data: SolunarData
}

export default function HourlyActivityChart({ data }: HourlyActivityChartProps) {
  const getBarColor = (score: number) => {
    if (score >= 80) return Colors.secondary.lightGreen
    if (score >= 60) return Colors.accent.gold
    if (score >= 40) return Colors.accent.orange
    return Colors.light.border
  }

  const getBarHeight = (score: number) => {
    return Math.max(8, (score / 100) * 60) // Min 8px, max 60px
  }

  const isPrimeTime = (hour: number) => {
    const sunriseHour = data.sunTimes.sunrise.getHours()
    const sunsetHour = data.sunTimes.sunset.getHours()
    return Math.abs(hour - sunriseHour) <= 1 || Math.abs(hour - sunsetHour) <= 1
  }

  const isBestTime = (hour: number) => {
    return data.bestTimes.some(bt => bt.hour === hour)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activitate pe ore - Azi</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartContainer}
      >
        {data.hourlyScores.map((score, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barColumn}>
              {isBestTime(index) && (
                <View style={styles.bestTimeIndicator}>
                  <Text style={styles.starIcon}>⭐</Text>
                </View>
              )}
              
              <View 
                style={[
                  styles.bar,
                  { 
                    height: getBarHeight(score),
                    backgroundColor: getBarColor(score)
                  }
                ]}
              />
              
            </View>
            
            <Text style={[
              styles.hourLabel,
              isBestTime(index) && styles.bestHourLabel
            ]}>
              {index.toString().padStart(2, '0')}
            </Text>
            
            {score > 0 && (
              <Text style={styles.scoreLabel}>{score}</Text>
            )}
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.secondary.lightGreen }]} />
          <Text style={styles.legendText}>Excelent (80+)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.accent.gold }]} />
          <Text style={styles.legendText}>Bun (60+)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.accent.orange }]} />
          <Text style={styles.legendText}>Moderat (40+)</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.blue,
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    paddingHorizontal: 8,
    alignItems: 'flex-end',
    paddingBottom: 16,
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 3,
    width: 28,
  },
  barColumn: {
    alignItems: 'center',
    height: 80,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  bestTimeIndicator: {
    position: 'absolute',
    top: -20,
    zIndex: 1,
  },
  starIcon: {
    fontSize: 14,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 8,
  },
  hourLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  bestHourLabel: {
    color: Colors.primary.blue,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 8,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
    paddingTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 2,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
})