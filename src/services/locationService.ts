import { FishingSpot } from '../types/database'
import { sampleFishingSpots } from '../data/fishingSpots'

export interface LocationSuggestion {
  id: string
  name: string
  waterBody: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  species?: string[]
  price?: number
  isFromDatabase: boolean
  distance?: number
}

// Convert fishing spot to location suggestion
const spotToSuggestion = (spot: FishingSpot): LocationSuggestion => ({
  id: spot.id,
  name: spot.name,
  waterBody: inferWaterBodyType(spot.name),
  coordinates: {
    latitude: spot.latitude,
    longitude: spot.longitude
  },
  species: spot.species,
  price: spot.price,
  isFromDatabase: true
})

// Infer water body type from spot name
const inferWaterBodyType = (name: string): string => {
  const lowercaseName = name.toLowerCase()
  if (lowercaseName.includes('lac')) return 'Lac'
  if (lowercaseName.includes('râu') || lowercaseName.includes('timiș')) return 'Râu'
  if (lowercaseName.includes('canal') || lowercaseName.includes('bega')) return 'Canal'
  if (lowercaseName.includes('baltă')) return 'Baltă'
  if (lowercaseName.includes('iaz')) return 'Iaz'
  return 'Lac' // default
}

// Fuzzy search function
const fuzzyMatch = (query: string, target: string): number => {
  if (target.toLowerCase().includes(query.toLowerCase())) {
    return query.length / target.length // Exact substring match gets higher score
  }
  
  // Simple character matching for fuzzy search
  const queryChars = query.toLowerCase().split('')
  const targetChars = target.toLowerCase().split('')
  let matches = 0
  let queryIndex = 0
  
  for (const char of targetChars) {
    if (queryIndex < queryChars.length && char === queryChars[queryIndex]) {
      matches++
      queryIndex++
    }
  }
  
  return matches / Math.max(query.length, target.length)
}

// Search fishing spots with fuzzy matching
export const searchFishingSpots = (query: string): LocationSuggestion[] => {
  if (query.length < 2) return []
  
  const suggestions = sampleFishingSpots
    .map(spot => ({
      suggestion: spotToSuggestion(spot),
      score: Math.max(
        fuzzyMatch(query, spot.name),
        fuzzyMatch(query, spot.species?.join(' ') || ''),
        fuzzyMatch(query, inferWaterBodyType(spot.name))
      )
    }))
    .filter(({ score }) => score > 0.3) // Minimum match threshold
    .sort((a, b) => b.score - a.score) // Sort by relevance
    .slice(0, 5) // Limit results
    .map(({ suggestion }) => suggestion)
  
  return suggestions
}

// Get recent locations (would be from AsyncStorage or database in production)
export const getRecentLocations = (): LocationSuggestion[] => {
  // Mock recent locations - in production this would come from user history
  return [
    {
      id: 'recent-1',
      name: 'Lacul Surduc',
      waterBody: 'Lac',
      coordinates: { latitude: 45.8234, longitude: 21.9876 },
      isFromDatabase: true
    },
    {
      id: 'recent-2', 
      name: 'Bega - Zona Fabric',
      waterBody: 'Canal',
      coordinates: { latitude: 45.7489, longitude: 21.2287 },
      isFromDatabase: true
    }
  ]
}

// Get all fishing spots for dropdown
export const getAllFishingSpots = (): LocationSuggestion[] => {
  return sampleFishingSpots.map(spotToSuggestion)
}

// Create custom location suggestion for manual entries
export const createCustomLocation = (name: string, waterBody: string = 'Lac'): LocationSuggestion => ({
  id: `custom-${Date.now()}`,
  name,
  waterBody,
  isFromDatabase: false
})

// Get spot details by ID
export const getSpotById = (id: string): FishingSpot | null => {
  return sampleFishingSpots.find(spot => spot.id === id) || null
}