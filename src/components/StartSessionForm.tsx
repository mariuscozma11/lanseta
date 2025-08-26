import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ActiveSession, WeatherConditions } from '../types/journal'
import { commonTechniques, commonBaits } from '../data/journal'
import WeatherWidget from './WeatherWidget'
import LocationAutocomplete from './LocationAutocomplete'
import { LocationSuggestion } from '../services/locationService'
import { Colors } from '../constants/Colors'

interface StartSessionFormProps {
  onStartSession: (session: ActiveSession) => void
  onCancel: () => void
}

export default function StartSessionForm({ onStartSession, onCancel }: StartSessionFormProps) {
  const [formData, setFormData] = useState({
    locationName: '',
    waterBody: 'Lac',
    notes: '',
    coordinates: undefined as { latitude: number; longitude: number } | undefined,
  })
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null)

  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([])
  const [selectedBaits, setSelectedBaits] = useState<string[]>([])
  const [weather, setWeather] = useState<WeatherConditions | null>(null)

  const waterBodyOptions = ['Lac', 'Râu', 'Canal', 'Baltă', 'Iaz']

  const handleStartSession = () => {
    if (!formData.locationName.trim()) {
      Alert.alert('Eroare', 'Te rog să introduci locația')
      return
    }

    if (selectedTechniques.length === 0) {
      Alert.alert('Eroare', 'Te rog să selectezi cel puțin o tehnică de pescuit')
      return
    }

    const session: ActiveSession = {
      id: `active-session-${Date.now()}`,
      startDate: new Date(),
      startTime: new Date().toLocaleTimeString('ro-RO', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      location: {
        name: formData.locationName,
        coordinates: formData.coordinates,
        waterBody: formData.waterBody
      },
      catches: [],
      techniques: selectedTechniques,
      baits: selectedBaits,
      weather: weather || {
        temperature: 20,
        humidity: 60,
        pressure: 1013,
        windSpeed: 5,
        windDirection: 'N',
        conditions: 'Parțial noros'
      },
      waterConditions: {
        clarity: 'Limpede',
        level: 'Normal'
      },
      notes: formData.notes,
      photos: []
    }

    onStartSession(session)
  }

  const toggleTechnique = (technique: string) => {
    setSelectedTechniques(prev => 
      prev.includes(technique) 
        ? prev.filter(t => t !== technique)
        : [...prev, technique]
    )
  }

  const toggleBait = (bait: string) => {
    setSelectedBaits(prev => 
      prev.includes(bait) 
        ? prev.filter(b => b !== bait)
        : [...prev, bait]
    )
  }

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location)
    setFormData(prev => ({
      ...prev,
      locationName: location.name,
      waterBody: location.waterBody,
      coordinates: location.coordinates
    }))
  }

  const handleLocationTextChange = (text: string) => {
    setFormData(prev => ({
      ...prev,
      locationName: text
    }))
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Anulează</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Începe Sesiune</Text>
        <TouchableOpacity style={styles.startButton} onPress={handleStartSession}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Locația</Text>
          
          <Text style={styles.label}>Nume locație</Text>
          <LocationAutocomplete
            value={formData.locationName}
            onLocationSelect={handleLocationSelect}
            onTextChange={handleLocationTextChange}
            placeholder="ex: Lacul Surduc, Bega - zona centrală"
            autoFocus={true}
          />

          {selectedLocation && selectedLocation.isFromDatabase && (
            <View style={styles.locationPreview}>
              <View style={styles.locationPreviewHeader}>
                <Ionicons name="information-circle" size={16} color={Colors.primary.blue} />
                <Text style={styles.locationPreviewTitle}>Informații locație</Text>
              </View>
              
              {selectedLocation.species && selectedLocation.species.length > 0 && (
                <View style={styles.locationDetail}>
                  <Ionicons name="fish" size={14} color={Colors.secondary.lightGreen} />
                  <Text style={styles.locationDetailText}>
                    Specii: {selectedLocation.species.join(', ')}
                  </Text>
                </View>
              )}
              
              {selectedLocation.price !== undefined && (
                <View style={styles.locationDetail}>
                  <Ionicons name="card" size={14} color={Colors.accent.gold} />
                  <Text style={styles.locationDetailText}>
                    {selectedLocation.price > 0 ? `Taxă: ${selectedLocation.price} RON/zi` : 'Gratuit'}
                  </Text>
                </View>
              )}
            </View>
          )}

          <Text style={styles.label}>Tip apă</Text>
          <View style={styles.optionsContainer}>
            {waterBodyOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  formData.waterBody === option && styles.selectedOption
                ]}
                onPress={() => setFormData(prev => ({ ...prev, waterBody: option }))}
              >
                <Text style={[
                  styles.optionText,
                  formData.waterBody === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tehnici de Pescuit</Text>
          <Text style={styles.sectionSubtitle}>Selectează tehnicile pe care plănuiești să le folosești</Text>
          
          <View style={styles.optionsContainer}>
            {commonTechniques.slice(0, 10).map((technique) => (
              <TouchableOpacity
                key={technique}
                style={[
                  styles.optionButton,
                  selectedTechniques.includes(technique) && styles.selectedOption
                ]}
                onPress={() => toggleTechnique(technique)}
              >
                <Text style={[
                  styles.optionText,
                  selectedTechniques.includes(technique) && styles.selectedOptionText
                ]}>
                  {technique}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Momeală Disponibilă</Text>
          <Text style={styles.sectionSubtitle}>Selectează momeala pe care o ai cu tine</Text>
          
          <View style={styles.optionsContainer}>
            {commonBaits.slice(0, 10).map((bait) => (
              <TouchableOpacity
                key={bait}
                style={[
                  styles.optionButton,
                  selectedBaits.includes(bait) && styles.selectedOption
                ]}
                onPress={() => toggleBait(bait)}
              >
                <Text style={[
                  styles.optionText,
                  selectedBaits.includes(bait) && styles.selectedOptionText
                ]}>
                  {bait}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condiții Météo</Text>
          <WeatherWidget 
            onWeatherUpdate={setWeather}
            showFishingTips={true}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notițe Inițiale</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Strategia pentru azi, observații despre locație..."
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={20} color={Colors.primary.blue} />
          <Text style={styles.infoText}>
            După ce începi sesiunea, vei putea adăuga capturi pe măsură ce le faci și actualiza condițiile dacă se schimbă.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.error.red,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  startButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.secondary.lightGreen,
    borderRadius: 8,
  },
  startButtonText: {
    fontSize: 16,
    color: Colors.neutral.white,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary.blue,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.neutral.white,
    marginBottom: 12,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  halfWidth: {
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.neutral.white,
  },
  selectedOption: {
    backgroundColor: Colors.primary.blue,
    borderColor: Colors.primary.blue,
  },
  optionText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '600',
  },
  selectedOptionText: {
    color: Colors.neutral.white,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.primary.blue + '10',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary.blue,
    lineHeight: 20,
  },
  locationPreview: {
    backgroundColor: Colors.primary.blue + '08',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  locationPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  locationPreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.blue,
  },
  locationDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  locationDetailText: {
    fontSize: 13,
    color: Colors.light.text,
    flex: 1,
  },
})