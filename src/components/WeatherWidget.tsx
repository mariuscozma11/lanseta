import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { WeatherConditions } from '../types/journal'
import { getCurrentWeather, getWeatherIcon, getFishingConditions, WeatherData } from '../services/weatherService'
import { Colors } from '../constants/Colors'

interface WeatherWidgetProps {
  onWeatherUpdate?: (weather: WeatherConditions) => void
  showFishingTips?: boolean
  compact?: boolean
}

export default function WeatherWidget({ 
  onWeatherUpdate, 
  showFishingTips = false,
  compact = false 
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchWeather = async () => {
    setLoading(true)
    try {
      const weatherData = await getCurrentWeather()
      if (weatherData) {
        setWeather(weatherData)
        setLastUpdate(new Date())
        
        // Update parent component if callback provided
        if (onWeatherUpdate) {
          const weatherConditions: WeatherConditions = {
            temperature: weatherData.temperature,
            humidity: weatherData.humidity,
            pressure: weatherData.pressure,
            windSpeed: weatherData.windSpeed,
            windDirection: weatherData.windDirection,
            conditions: weatherData.conditions as any
          }
          onWeatherUpdate(weatherConditions)
        }
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
  }, [])

  if (!weather && !loading) {
    return (
      <TouchableOpacity style={styles.errorContainer} onPress={fetchWeather}>
        <Ionicons name="cloud-offline" size={20} color={Colors.light.textSecondary} />
        <Text style={styles.errorText}>Apasă pentru vremea actuală</Text>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <View style={[styles.container, compact && styles.compactContainer]}>
        <ActivityIndicator size="small" color={Colors.primary.blue} />
        <Text style={styles.loadingText}>Se încarcă vremea...</Text>
      </View>
    )
  }

  if (!weather) return null

  const fishingConditions = getFishingConditions(weather)
  const updateText = lastUpdate 
    ? `Actualizat ${lastUpdate.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}`
    : 'Actualizează vremea'

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={fetchWeather}>
        <Ionicons 
          name={getWeatherIcon(weather.conditions) as any} 
          size={20} 
          color={Colors.accent.orange} 
        />
        <Text style={styles.compactTemp}>{weather.temperature}°C</Text>
        <Text style={styles.compactConditions}>{weather.conditions}</Text>
        <View style={styles.windInfo}>
          <Ionicons name="flag" size={14} color={Colors.light.textSecondary} />
          <Text style={styles.compactWind}>{weather.windSpeed}km/h</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="partly-sunny" size={20} color={Colors.primary.blue} />
          <Text style={styles.title}>Condiții Actuale</Text>
        </View>
        
        <TouchableOpacity style={styles.refreshButton} onPress={fetchWeather}>
          <Ionicons 
            name="refresh" 
            size={16} 
            color={Colors.primary.blue}
            style={loading ? styles.spinning : undefined}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.mainWeather}>
        <View style={styles.temperatureSection}>
          <Ionicons 
            name={getWeatherIcon(weather.conditions) as any} 
            size={32} 
            color={Colors.accent.orange} 
          />
          <Text style={styles.temperature}>{weather.temperature}°C</Text>
        </View>
        
        <View style={styles.conditionsSection}>
          <Text style={styles.conditions}>{weather.conditions}</Text>
          <Text style={styles.description}>{weather.description}</Text>
        </View>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Ionicons name="water" size={16} color={Colors.primary.blue} />
          <Text style={styles.detailLabel}>Umiditate</Text>
          <Text style={styles.detailValue}>{weather.humidity}%</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="speedometer" size={16} color={Colors.primary.blue} />
          <Text style={styles.detailLabel}>Presiune</Text>
          <Text style={styles.detailValue}>{weather.pressure} mb</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="flag" size={16} color={Colors.primary.blue} />
          <Text style={styles.detailLabel}>Vânt</Text>
          <Text style={styles.detailValue}>
            {weather.windSpeed} km/h {weather.windDirection}
          </Text>
        </View>
      </View>

      {showFishingTips && (
        <View style={[styles.fishingTips, { borderLeftColor: fishingConditions.color }]}>
          <View style={styles.fishingHeader}>
            <Ionicons name="fish" size={16} color={fishingConditions.color} />
            <Text style={[styles.fishingRating, { color: fishingConditions.color }]}>
              Condiții: {fishingConditions.rating}
            </Text>
          </View>
          
          {fishingConditions.tips.map((tip, index) => (
            <Text key={index} style={styles.fishingTip}>
              • {tip}
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.updateTime}>{updateText}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.blue,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinning: {
    // Add animation in production
  },
  mainWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  temperatureSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  temperature: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
  },
  conditionsSection: {
    flex: 1,
  },
  conditions: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 2,
    textAlign: 'center',
  },
  fishingTips: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderLeftWidth: 3,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  fishingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  fishingRating: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  fishingTip: {
    fontSize: 13,
    color: Colors.light.text,
    lineHeight: 18,
    marginBottom: 2,
  },
  updateTime: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  compactTemp: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  compactConditions: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  windInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  compactWind: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: 8,
  },
})