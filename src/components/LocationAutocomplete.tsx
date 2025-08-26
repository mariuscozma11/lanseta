import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Keyboard,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LocationSuggestion, searchFishingSpots, getRecentLocations, createCustomLocation } from '../services/locationService'
import { Colors } from '../constants/Colors'

interface LocationAutocompleteProps {
  value: string
  onLocationSelect: (location: LocationSuggestion) => void
  onTextChange: (text: string) => void
  placeholder?: string
  autoFocus?: boolean
}

const { width, height } = Dimensions.get('window')

export default function LocationAutocomplete({
  value,
  onLocationSelect,
  onTextChange,
  placeholder = "ex: Lacul Surduc, Bega - zona centrală",
  autoFocus = false
}: LocationAutocompleteProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [recentLocations, setRecentLocations] = useState<LocationSuggestion[]>([])
  const dropdownAnim = useRef(new Animated.Value(0)).current
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    // Load recent locations on mount
    setRecentLocations(getRecentLocations())
    
    // Listen for keyboard events to manage dropdown
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      // Hide dropdown when keyboard is dismissed
      setTimeout(() => {
        hideDropdownWithAnimation()
      }, 100)
    })

    return () => {
      keyboardDidHideListener?.remove()
    }
  }, [])

  useEffect(() => {
    if (value.length >= 2) {
      const searchResults = searchFishingSpots(value)
      setSuggestions(searchResults)
      showDropdownWithAnimation()
    } else if (value.length === 0) {
      // Show recent locations when input is empty but focused
      setSuggestions(recentLocations)
      if (showDropdown) {
        showDropdownWithAnimation()
      }
    } else {
      hideDropdownWithAnimation()
    }
  }, [value])

  const showDropdownWithAnimation = () => {
    setShowDropdown(true)
    Animated.spring(dropdownAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start()
  }

  const hideDropdownWithAnimation = () => {
    Animated.spring(dropdownAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => setShowDropdown(false))
  }

  const handleFocus = () => {
    if (value.length === 0 && recentLocations.length > 0) {
      setSuggestions(recentLocations)
      showDropdownWithAnimation()
    } else if (value.length >= 2) {
      showDropdownWithAnimation()
    }
  }

  const handleBlur = () => {
    // Delay hiding to allow selection, but only if keyboard is still visible
    setTimeout(() => {
      // Don't hide if user is interacting with dropdown
      if (!showDropdown) return
      hideDropdownWithAnimation()
    }, 150)
  }

  const handleSuggestionPress = (suggestion: LocationSuggestion) => {
    onTextChange(suggestion.name)
    onLocationSelect(suggestion)
    hideDropdownWithAnimation()
    inputRef.current?.blur()
  }

  const handleManualEntry = () => {
    if (value.trim()) {
      const customLocation = createCustomLocation(value.trim())
      onLocationSelect(customLocation)
      hideDropdownWithAnimation()
      inputRef.current?.blur()
    }
  }

  const getLocationIcon = (waterBody: string) => {
    switch (waterBody.toLowerCase()) {
      case 'lac': return 'water'
      case 'râu': return 'git-network'
      case 'canal': return 'resize'
      case 'baltă': return 'ellipse'
      case 'iaz': return 'radio-button-off'
      default: return 'location'
    }
  }

  const renderSuggestionItem = (suggestion: LocationSuggestion, index: number) => (
    <TouchableOpacity
      key={`${suggestion.id}-${index}`}
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(suggestion)}
      activeOpacity={0.7}
    >
      <View style={styles.suggestionLeft}>
        <View style={[styles.locationIcon, { backgroundColor: suggestion.isFromDatabase ? Colors.primary.blue + '20' : Colors.light.backgroundSecondary }]}>
          <Ionicons 
            name={getLocationIcon(suggestion.waterBody) as any} 
            size={16} 
            color={suggestion.isFromDatabase ? Colors.primary.blue : Colors.light.textSecondary} 
          />
        </View>
        
        <View style={styles.suggestionInfo}>
          <Text style={styles.suggestionName}>{suggestion.name}</Text>
          <View style={styles.suggestionMeta}>
            <Text style={styles.suggestionType}>{suggestion.waterBody}</Text>
            {suggestion.species && suggestion.species.length > 0 && (
              <>
                <Text style={styles.metaSeparator}>•</Text>
                <Text style={styles.suggestionSpecies}>
                  {suggestion.species.slice(0, 2).join(', ')}
                  {suggestion.species.length > 2 && ` +${suggestion.species.length - 2}`}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      <View style={styles.suggestionRight}>
        {suggestion.price !== undefined && suggestion.price > 0 && (
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{suggestion.price} RON</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={16} color={Colors.light.textSecondary} />
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoCapitalize="words"
        autoFocus={autoFocus}
        returnKeyType="done"
        onSubmitEditing={handleManualEntry}
      />

      {showDropdown && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              opacity: dropdownAnim,
              transform: [
                {
                  translateY: dropdownAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <ScrollView
            style={styles.dropdownScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            bounces={false}
          >
            {value.length === 0 && recentLocations.length > 0 && (
              <View style={styles.sectionHeader}>
                <Ionicons name="time" size={14} color={Colors.light.textSecondary} />
                <Text style={styles.sectionTitle}>Locații recente</Text>
              </View>
            )}
            
            {value.length >= 2 && suggestions.length > 0 && (
              <View style={styles.sectionHeader}>
                <Ionicons name="search" size={14} color={Colors.light.textSecondary} />
                <Text style={styles.sectionTitle}>Locații sugerate</Text>
              </View>
            )}

            {suggestions.map((suggestion, index) => renderSuggestionItem(suggestion, index))}

            {value.trim() && !suggestions.some(s => s.name.toLowerCase() === value.toLowerCase()) && (
              <>
                <View style={styles.sectionDivider} />
                <TouchableOpacity
                  style={styles.customLocationItem}
                  onPress={handleManualEntry}
                  activeOpacity={0.7}
                >
                  <View style={styles.customLocationIcon}>
                    <Ionicons name="add" size={16} color={Colors.secondary.lightGreen} />
                  </View>
                  <View style={styles.customLocationInfo}>
                    <Text style={styles.customLocationText}>Folosește "{value}"</Text>
                    <Text style={styles.customLocationSubtext}>Locație nouă</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.light.textSecondary} />
                </TouchableOpacity>
              </>
            )}

            {suggestions.length === 0 && value.length >= 2 && (
              <View style={styles.noResults}>
                <Ionicons name="search" size={24} color={Colors.light.textSecondary} />
                <Text style={styles.noResultsText}>Nicio locație găsită</Text>
                <Text style={styles.noResultsSubtext}>Încearcă să cauți diferit sau adaugă o locație nouă</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
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
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: Math.min(height * 0.4, 300), // Responsive max height
    zIndex: 1001,
  },
  dropdownScroll: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.light.borderLight,
    marginVertical: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  suggestionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  suggestionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  suggestionType: {
    fontSize: 12,
    color: Colors.primary.blue,
    fontWeight: '600',
  },
  metaSeparator: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  suggestionSpecies: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  suggestionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceTag: {
    backgroundColor: Colors.accent.gold + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priceText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.accent.gold,
  },
  customLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  customLocationIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.secondary.lightGreen + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customLocationInfo: {
    flex: 1,
  },
  customLocationText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary.lightGreen,
  },
  customLocationSubtext: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
})