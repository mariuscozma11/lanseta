import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FishSpecies, SpeciesFilters } from '../types/species'
import SpeciesFiltersComponent from './SpeciesFilters'
import { Colors } from '../constants/Colors'

interface SpeciesListProps {
  species: FishSpecies[]
  onSpeciesPress: (species: FishSpecies) => void
}

export default function SpeciesList({ species, onSpeciesPress }: SpeciesListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredSpecies, setFilteredSpecies] = useState(species)
  const [filters, setFilters] = useState<SpeciesFilters>({})
  const [filtersVisible, setFiltersVisible] = useState(false)

  const applyFilters = (searchQuery: string, filters: SpeciesFilters) => {
    let filtered = species

    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(s => 
        s.romanianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.commonNames.some(name => name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        s.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply family filter
    if (filters.family) {
      filtered = filtered.filter(s => s.family === filters.family)
    }

    // Apply habitat filter
    if (filters.habitat && filters.habitat.length > 0) {
      filtered = filtered.filter(s => 
        filters.habitat!.some(habitat => s.habitat.includes(habitat))
      )
    }

    // Apply difficulty filter
    if (filters.difficulty && filters.difficulty.length > 0) {
      filtered = filtered.filter(s => 
        filters.difficulty!.includes(s.fishingInfo.difficulty)
      )
    }

    // Apply season filter
    if (filters.season && filters.season.length > 0) {
      filtered = filtered.filter(s => 
        filters.season!.some(season => s.fishingInfo.bestSeasons.includes(season))
      )
    }

    // Apply size filter
    if (filters.size) {
      filtered = filtered.filter(s => {
        if (filters.size === 'small') return s.size.maxLength < 30
        if (filters.size === 'medium') return s.size.maxLength >= 30 && s.size.maxLength <= 80
        if (filters.size === 'large') return s.size.maxLength > 80
        return true
      })
    }

    setFilteredSpecies(filtered)
  }

  useEffect(() => {
    applyFilters(searchQuery, filters)
  }, [searchQuery, filters, species])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFiltersChange = (newFilters: SpeciesFilters) => {
    setFilters(newFilters)
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

  const getSizeCategory = (maxLength: number) => {
    if (maxLength < 30) return 'Mic'
    if (maxLength < 80) return 'Mediu'
    return 'Mare'
  }

  const renderSpeciesItem = ({ item }: { item: FishSpecies }) => (
    <TouchableOpacity
      style={styles.speciesCard}
      onPress={() => onSpeciesPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.speciesInfo}>
          <Text style={styles.speciesName}>{item.romanianName}</Text>
          <Text style={styles.scientificName}>{item.scientificName}</Text>
          <Text style={styles.commonNames}>
            {item.commonNames.slice(0, 2).join(', ')}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.light.textSecondary} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.tagContainer}>
          <View style={[styles.tag, styles.familyTag]}>
            <Text style={styles.tagText}>{item.family}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: getDifficultyColor(item.fishingInfo.difficulty) }]}>
            <Text style={[styles.tagText, { color: Colors.neutral.white }]}>
              {item.fishingInfo.difficulty}
            </Text>
          </View>
          <View style={[styles.tag, styles.sizeTag]}>
            <Text style={styles.tagText}>
              {getSizeCategory(item.size.maxLength)} ({item.size.maxLength}cm)
            </Text>
          </View>
        </View>

        <View style={styles.habitatContainer}>
          <Ionicons name="location" size={14} color={Colors.primary.blue} />
          <Text style={styles.habitatText}>
            {item.habitat.slice(0, 3).join(', ')}
          </Text>
        </View>

        <View style={styles.conservationContainer}>
          <View style={[
            styles.conservationBadge,
            { backgroundColor: item.conservation.status === 'Comun' ? Colors.secondary.lightGreen : 
                                item.conservation.status === 'Moderat' ? Colors.warning.orange :
                                item.conservation.status === 'Rar' ? Colors.error.red :
                                Colors.neutral.black }
          ]}>
            <Text style={[styles.conservationText, { color: Colors.neutral.white }]}>
              {item.conservation.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Caută specii de pești..."
            placeholderTextColor={Colors.light.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            getActiveFilterCount() > 0 && styles.activeFilterButton
          ]} 
          onPress={() => setFiltersVisible(true)}
        >
          <Ionicons 
            name="filter" 
            size={20} 
            color={getActiveFilterCount() > 0 ? Colors.neutral.white : Colors.light.textSecondary} 
          />
          {getActiveFilterCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredSpecies.length} specii găsite
        </Text>
      </View>

      <FlatList
        data={filteredSpecies}
        renderItem={renderSpeciesItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        visible={filtersVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFiltersVisible(false)}
      >
        <SpeciesFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClose={() => setFiltersVisible(false)}
        />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary.blue,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error.red,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  speciesCard: {
    backgroundColor: Colors.neutral.white,
    marginHorizontal: 16,
    marginBottom: 12,
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
    marginBottom: 12,
  },
  speciesInfo: {
    flex: 1,
  },
  speciesName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 2,
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  commonNames: {
    fontSize: 13,
    color: Colors.primary.blue,
    fontWeight: '600',
  },
  cardBody: {
    gap: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  familyTag: {
    backgroundColor: Colors.light.backgroundSecondary,
  },
  sizeTag: {
    backgroundColor: Colors.light.backgroundSecondary,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
  },
  habitatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  habitatText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  conservationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conservationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  conservationText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
})