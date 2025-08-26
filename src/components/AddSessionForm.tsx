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
import { FishingSession, FishCatch, WeatherConditions } from '../types/journal'
import { fishSpecies } from '../data/species'
import { commonTechniques, commonBaits, weatherConditions } from '../data/journal'
import { Colors } from '../constants/Colors'

interface AddSessionFormProps {
  onSave: (session: FishingSession) => void
  onCancel: () => void
}

export default function AddSessionForm({ onSave, onCancel }: AddSessionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '06:00',
    endTime: '12:00',
    locationName: '',
    waterBody: 'Lac',
    notes: '',
    rating: 3,
  })

  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([])
  const [selectedBaits, setSelectedBaits] = useState<string[]>([])
  const [catches, setCatches] = useState<Partial<FishCatch>[]>([])
  
  const [weather, setWeather] = useState<Partial<WeatherConditions>>({
    temperature: 20,
    conditions: 'Parțial noros' as const
  })

  const waterBodyOptions = ['Lac', 'Râu', 'Canal', 'Baltă', 'Iaz']

  const handleSave = () => {
    if (!formData.locationName.trim()) {
      Alert.alert('Eroare', 'Te rog să introduci locația')
      return
    }

    const session: FishingSession = {
      id: `session-${Date.now()}`,
      date: new Date(formData.date),
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: {
        name: formData.locationName,
        waterBody: formData.waterBody
      },
      catches: catches.filter(c => c.speciesId && c.length && c.weight).map(c => ({
        id: `catch-${Date.now()}-${Math.random()}`,
        speciesId: c.speciesId!,
        speciesName: c.speciesName!,
        length: c.length!,
        weight: c.weight!,
        released: c.released || false,
        notes: c.notes || ''
      })),
      techniques: selectedTechniques,
      baits: selectedBaits,
      weather: {
        temperature: weather.temperature || 20,
        humidity: 60,
        pressure: 1013,
        windSpeed: 5,
        windDirection: 'N',
        conditions: weather.conditions || 'Parțial noros'
      },
      waterConditions: {
        clarity: 'Limpede',
        level: 'Normal'
      },
      notes: formData.notes,
      photos: [],
      rating: formData.rating,
      public: false
    }

    onSave(session)
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

  const addCatch = () => {
    setCatches(prev => [...prev, {
      speciesId: '',
      speciesName: '',
      length: 0,
      weight: 0,
      released: false,
      notes: ''
    }])
  }

  const removeCatch = (index: number) => {
    setCatches(prev => prev.filter((_, i) => i !== index))
  }

  const updateCatch = (index: number, field: string, value: any) => {
    setCatches(prev => prev.map((catch_, i) => 
      i === index ? { ...catch_, [field]: value } : catch_
    ))
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <TouchableOpacity
        key={i}
        onPress={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
      >
        <Ionicons
          name={i < rating ? 'star' : 'star-outline'}
          size={24}
          color={Colors.accent.gold}
        />
      </TouchableOpacity>
    ))
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
        <Text style={styles.headerTitle}>Sesiune Nouă</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvează</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalii Generale</Text>
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Data</Text>
              <TextInput
                style={styles.input}
                value={formData.date}
                onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
                placeholder="YYYY-MM-DD"
              />
            </View>
            
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Evaluare</Text>
              <View style={styles.ratingContainer}>
                {getRatingStars(formData.rating)}
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Ora început</Text>
              <TextInput
                style={styles.input}
                value={formData.startTime}
                onChangeText={(text) => setFormData(prev => ({ ...prev, startTime: text }))}
                placeholder="HH:MM"
              />
            </View>
            
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Ora sfârșit</Text>
              <TextInput
                style={styles.input}
                value={formData.endTime}
                onChangeText={(text) => setFormData(prev => ({ ...prev, endTime: text }))}
                placeholder="HH:MM"
              />
            </View>
          </View>

          <Text style={styles.label}>Locația</Text>
          <TextInput
            style={styles.input}
            value={formData.locationName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, locationName: text }))}
            placeholder="ex: Lacul Surduc"
          />

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
          <Text style={styles.sectionTitle}>Capturi</Text>
          
          {catches.map((catch_, index) => (
            <View key={index} style={styles.catchContainer}>
              <View style={styles.catchHeader}>
                <Text style={styles.catchTitle}>Captura #{index + 1}</Text>
                <TouchableOpacity onPress={() => removeCatch(index)}>
                  <Ionicons name="trash" size={20} color={Colors.error.red} />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Specia</Text>
              <View style={styles.speciesContainer}>
                {fishSpecies.slice(0, 6).map((species) => (
                  <TouchableOpacity
                    key={species.id}
                    style={[
                      styles.speciesButton,
                      catch_.speciesId === species.id && styles.selectedSpecies
                    ]}
                    onPress={() => {
                      updateCatch(index, 'speciesId', species.id)
                      updateCatch(index, 'speciesName', species.romanianName)
                    }}
                  >
                    <Text style={[
                      styles.speciesButtonText,
                      catch_.speciesId === species.id && styles.selectedSpeciesText
                    ]}>
                      {species.romanianName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Lungime (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={catch_.length?.toString() || ''}
                    onChangeText={(text) => updateCatch(index, 'length', parseInt(text) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
                
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Greutate (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={catch_.weight?.toString() || ''}
                    onChangeText={(text) => updateCatch(index, 'weight', parseFloat(text) || 0)}
                    keyboardType="decimal-pad"
                    placeholder="0.0"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => updateCatch(index, 'released', !catch_.released)}
              >
                <Ionicons
                  name={catch_.released ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={Colors.primary.blue}
                />
                <Text style={styles.checkboxText}>Eliberat</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addCatch}>
            <Ionicons name="add" size={20} color={Colors.primary.blue} />
            <Text style={styles.addButtonText}>Adaugă Captură</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tehnici</Text>
          <View style={styles.optionsContainer}>
            {commonTechniques.slice(0, 8).map((technique) => (
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
          <Text style={styles.sectionTitle}>Momeală</Text>
          <View style={styles.optionsContainer}>
            {commonBaits.slice(0, 8).map((bait) => (
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
          <Text style={styles.sectionTitle}>Vremea</Text>
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Temperatura (°C)</Text>
              <TextInput
                style={styles.input}
                value={weather.temperature?.toString() || ''}
                onChangeText={(text) => setWeather(prev => ({ ...prev, temperature: parseInt(text) || 20 }))}
                keyboardType="numeric"
                placeholder="20"
              />
            </View>
            
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Condiții</Text>
              <View style={styles.weatherContainer}>
                {weatherConditions.slice(0, 3).map((condition) => (
                  <TouchableOpacity
                    key={condition}
                    style={[
                      styles.weatherButton,
                      weather.conditions === condition && styles.selectedWeather
                    ]}
                    onPress={() => setWeather(prev => ({ ...prev, conditions: condition as any }))}
                  >
                    <Text style={[
                      styles.weatherButtonText,
                      weather.conditions === condition && styles.selectedWeatherText
                    ]}>
                      {condition}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notițe</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Detalii despre sesiune, observații, strategii..."
            multiline
            numberOfLines={4}
          />
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
  saveButton: {
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: Colors.primary.blue,
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
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 8,
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
  catchContainer: {
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  catchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  catchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  speciesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  speciesButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.neutral.white,
  },
  selectedSpecies: {
    backgroundColor: Colors.secondary.lightGreen,
    borderColor: Colors.secondary.lightGreen,
  },
  speciesButtonText: {
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: '600',
  },
  selectedSpeciesText: {
    color: Colors.neutral.white,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  checkboxText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary.blue,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 16,
    color: Colors.primary.blue,
    fontWeight: '600',
  },
  weatherContainer: {
    gap: 4,
  },
  weatherButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.neutral.white,
  },
  selectedWeather: {
    backgroundColor: Colors.accent.orange,
    borderColor: Colors.accent.orange,
  },
  weatherButtonText: {
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedWeatherText: {
    color: Colors.neutral.white,
  },
})