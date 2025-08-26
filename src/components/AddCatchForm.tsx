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
import { FishCatch } from '../types/journal'
import { fishSpecies } from '../data/species'
import PhotoCapture from './PhotoCapture'
import { Colors } from '../constants/Colors'

interface AddCatchFormProps {
  onSave: (catch_: FishCatch) => void
  onCancel: () => void
}

export default function AddCatchForm({ onSave, onCancel }: AddCatchFormProps) {
  const [catchData, setCatchData] = useState({
    speciesId: '',
    speciesName: '',
    length: '',
    weight: '',
    released: false,
    notes: '',
    photos: [] as string[]
  })

  const handleSave = () => {
    if (!catchData.speciesId) {
      Alert.alert('Eroare', 'Te rog să selectezi specia')
      return
    }

    if (!catchData.length || parseInt(catchData.length) <= 0) {
      Alert.alert('Eroare', 'Te rog să introduci lungimea peștelui')
      return
    }

    if (!catchData.weight || parseFloat(catchData.weight) <= 0) {
      Alert.alert('Eroare', 'Te rog să introduci greutatea peștelui')
      return
    }

    const newCatch: FishCatch = {
      id: `catch-${Date.now()}`,
      speciesId: catchData.speciesId,
      speciesName: catchData.speciesName,
      length: parseInt(catchData.length),
      weight: parseFloat(catchData.weight),
      released: catchData.released,
      notes: catchData.notes,
      photos: catchData.photos
    }

    onSave(newCatch)
  }

  const selectSpecies = (species: any) => {
    setCatchData(prev => ({
      ...prev,
      speciesId: species.id,
      speciesName: species.romanianName
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
        <Text style={styles.headerTitle}>Adaugă Captură</Text>
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
          <Text style={styles.sectionTitle}>Specia Prinsă</Text>
          
          <View style={styles.speciesGrid}>
            {fishSpecies.map((species) => (
              <TouchableOpacity
                key={species.id}
                style={[
                  styles.speciesButton,
                  catchData.speciesId === species.id && styles.selectedSpecies
                ]}
                onPress={() => selectSpecies(species)}
              >
                <Text style={[
                  styles.speciesButtonText,
                  catchData.speciesId === species.id && styles.selectedSpeciesText
                ]}>
                  {species.romanianName}
                </Text>
                <Text style={[
                  styles.speciesScientificText,
                  catchData.speciesId === species.id && styles.selectedSpeciesScientificText
                ]}>
                  {species.scientificName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Măsurători</Text>
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Lungime (cm)</Text>
              <TextInput
                style={styles.input}
                value={catchData.length}
                onChangeText={(text) => setCatchData(prev => ({ ...prev, length: text }))}
                keyboardType="numeric"
                placeholder="ex: 45"
                autoFocus
              />
            </View>
            
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Greutate (kg)</Text>
              <TextInput
                style={styles.input}
                value={catchData.weight}
                onChangeText={(text) => setCatchData(prev => ({ ...prev, weight: text }))}
                keyboardType="decimal-pad"
                placeholder="ex: 2.5"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          
          <View style={styles.releaseOptions}>
            <TouchableOpacity
              style={[
                styles.releaseOption,
                !catchData.released && styles.selectedReleaseOption
              ]}
              onPress={() => setCatchData(prev => ({ ...prev, released: false }))}
            >
              <View style={styles.releaseIcon}>
                <Ionicons 
                  name="fish" 
                  size={24} 
                  color={!catchData.released ? Colors.neutral.white : Colors.primary.blue} 
                />
              </View>
              <Text style={[
                styles.releaseOptionText,
                !catchData.released && styles.selectedReleaseOptionText
              ]}>
                Păstrat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.releaseOption,
                catchData.released && styles.selectedReleaseOption
              ]}
              onPress={() => setCatchData(prev => ({ ...prev, released: true }))}
            >
              <View style={styles.releaseIcon}>
                <Ionicons 
                  name="leaf" 
                  size={24} 
                  color={catchData.released ? Colors.neutral.white : Colors.secondary.lightGreen} 
                />
              </View>
              <Text style={[
                styles.releaseOptionText,
                catchData.released && styles.selectedReleaseOptionText
              ]}>
                Eliberat
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Poze</Text>
          <PhotoCapture
            photos={catchData.photos}
            onPhotosChange={(photos) => setCatchData(prev => ({ ...prev, photos }))}
            maxPhotos={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notițe</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={catchData.notes}
            onChangeText={(text) => setCatchData(prev => ({ ...prev, notes: text }))}
            placeholder="Momeala folosită, condiții, observații..."
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.tipContainer}>
          <Ionicons name="bulb" size={20} color={Colors.accent.gold} />
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>Sfat:</Text> Măsoară peștele cât mai rapid și eliberează-l cu grijă dacă nu intenționezi să-l păstrezi.
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
  saveButton: {
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: Colors.secondary.lightGreen,
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
  speciesGrid: {
    gap: 8,
  },
  speciesButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.neutral.white,
  },
  selectedSpecies: {
    backgroundColor: Colors.secondary.lightGreen,
    borderColor: Colors.secondary.lightGreen,
  },
  speciesButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  selectedSpeciesText: {
    color: Colors.neutral.white,
  },
  speciesScientificText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  selectedSpeciesScientificText: {
    color: Colors.neutral.white + 'CC',
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
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.neutral.white,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  releaseOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  releaseOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  selectedReleaseOption: {
    backgroundColor: Colors.primary.blue,
    borderColor: Colors.primary.blue,
  },
  releaseIcon: {
    marginBottom: 8,
  },
  releaseOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  selectedReleaseOptionText: {
    color: Colors.neutral.white,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.accent.gold + '10',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: '700',
    color: Colors.accent.gold,
  },
})