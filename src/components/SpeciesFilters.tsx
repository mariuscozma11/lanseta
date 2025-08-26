import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SpeciesFilters } from '../types/species'
import { speciesFamilies, habitatTypes, difficultyLevels, seasons } from '../data/species'
import { Colors } from '../constants/Colors'

interface SpeciesFiltersProps {
  filters: SpeciesFilters
  onFiltersChange: (filters: SpeciesFilters) => void
  onClose: () => void
}

export default function SpeciesFiltersComponent({ 
  filters, 
  onFiltersChange, 
  onClose 
}: SpeciesFiltersProps) {
  const toggleFamily = (family: string) => {
    onFiltersChange({
      ...filters,
      family: filters.family === family ? undefined : family
    })
  }

  const toggleHabitat = (habitat: string) => {
    const currentHabitats = filters.habitat || []
    const newHabitats = currentHabitats.includes(habitat)
      ? currentHabitats.filter(h => h !== habitat)
      : [...currentHabitats, habitat]
    
    onFiltersChange({
      ...filters,
      habitat: newHabitats.length > 0 ? newHabitats : undefined
    })
  }

  const toggleDifficulty = (difficulty: string) => {
    const currentDifficulties = filters.difficulty || []
    const newDifficulties = currentDifficulties.includes(difficulty)
      ? currentDifficulties.filter(d => d !== difficulty)
      : [...currentDifficulties, difficulty]
    
    onFiltersChange({
      ...filters,
      difficulty: newDifficulties.length > 0 ? newDifficulties : undefined
    })
  }

  const toggleSeason = (season: string) => {
    const currentSeasons = filters.season || []
    const newSeasons = currentSeasons.includes(season)
      ? currentSeasons.filter(s => s !== season)
      : [...currentSeasons, season]
    
    onFiltersChange({
      ...filters,
      season: newSeasons.length > 0 ? newSeasons : undefined
    })
  }

  const setSizeFilter = (size: 'small' | 'medium' | 'large' | undefined) => {
    onFiltersChange({
      ...filters,
      size: filters.size === size ? undefined : size
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.family) count++
    if (filters.habitat?.length) count++
    if (filters.difficulty?.length) count++
    if (filters.season?.length) count++
    if (filters.size) count++
    return count
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Ușor': return Colors.secondary.lightGreen
      case 'Mediu': return Colors.warning.orange
      case 'Greu': return Colors.error.red
      case 'Expert': return Colors.neutral.black
      default: return Colors.light.border
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Filtrează Speciile</Text>
          {getActiveFilterCount() > 0 && (
            <View style={styles.activeFiltersBadge}>
              <Text style={styles.activeFiltersText}>{getActiveFilterCount()}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerButtons}>
          {getActiveFilterCount() > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearAllFilters}>
              <Text style={styles.clearButtonText}>Șterge</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Familie</Text>
          <View style={styles.optionsContainer}>
            {speciesFamilies.map((family) => (
              <TouchableOpacity
                key={family}
                style={[
                  styles.optionButton,
                  filters.family === family && styles.selectedOption
                ]}
                onPress={() => toggleFamily(family)}
              >
                <Text style={[
                  styles.optionText,
                  filters.family === family && styles.selectedOptionText
                ]}>
                  {family}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dimensiune</Text>
          <View style={styles.optionsContainer}>
            {[
              { key: 'small', label: 'Mic (< 30cm)' },
              { key: 'medium', label: 'Mediu (30-80cm)' },
              { key: 'large', label: 'Mare (> 80cm)' }
            ].map((size) => (
              <TouchableOpacity
                key={size.key}
                style={[
                  styles.optionButton,
                  filters.size === size.key && styles.selectedOption
                ]}
                onPress={() => setSizeFilter(size.key as any)}
              >
                <Text style={[
                  styles.optionText,
                  filters.size === size.key && styles.selectedOptionText
                ]}>
                  {size.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dificultate Pescuit</Text>
          <View style={styles.optionsContainer}>
            {difficultyLevels.map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.optionButton,
                  { borderColor: getDifficultyColor(difficulty) },
                  filters.difficulty?.includes(difficulty) && {
                    backgroundColor: getDifficultyColor(difficulty)
                  }
                ]}
                onPress={() => toggleDifficulty(difficulty)}
              >
                <Text style={[
                  styles.optionText,
                  filters.difficulty?.includes(difficulty) && { color: Colors.neutral.white }
                ]}>
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habitat</Text>
          <View style={styles.optionsContainer}>
            {habitatTypes.map((habitat) => (
              <TouchableOpacity
                key={habitat}
                style={[
                  styles.optionButton,
                  filters.habitat?.includes(habitat) && styles.selectedOption
                ]}
                onPress={() => toggleHabitat(habitat)}
              >
                <Text style={[
                  styles.optionText,
                  filters.habitat?.includes(habitat) && styles.selectedOptionText
                ]}>
                  {habitat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sezon Optim</Text>
          <View style={styles.optionsContainer}>
            {seasons.map((season) => (
              <TouchableOpacity
                key={season}
                style={[
                  styles.optionButton,
                  filters.season?.includes(season) && styles.selectedOption
                ]}
                onPress={() => toggleSeason(season)}
              >
                <Text style={[
                  styles.optionText,
                  filters.season?.includes(season) && styles.selectedOptionText
                ]}>
                  {season}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  activeFiltersBadge: {
    backgroundColor: Colors.primary.blue,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  activeFiltersText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.error.red,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error.red,
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
    maxHeight: 500,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.blue,
    marginBottom: 12,
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
    fontWeight: '600',
    color: Colors.light.text,
  },
  selectedOptionText: {
    color: Colors.neutral.white,
  },
})