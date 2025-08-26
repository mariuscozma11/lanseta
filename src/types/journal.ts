export interface FishCatch {
  id: string
  speciesId: string
  speciesName: string
  length: number // cm
  weight: number // kg
  photos?: string[]
  released: boolean
  notes?: string
}

export interface WeatherConditions {
  temperature: number // Celsius
  humidity: number // percentage
  pressure: number // mbar
  windSpeed: number // km/h
  windDirection: string
  conditions: 'Senin' | 'Parțial noros' | 'Noros' | 'Ploios' | 'Furtună'
}

export interface FishingSession {
  id: string
  date: Date
  startTime: string // HH:MM
  endTime: string // HH:MM
  location: {
    name: string
    coordinates?: {
      latitude: number
      longitude: number
    }
    waterBody: string // Lake, River, Canal, etc.
  }
  catches: FishCatch[]
  techniques: string[]
  baits: string[]
  weather: WeatherConditions
  waterConditions: {
    temperature?: number // Celsius
    clarity: 'Foarte limpede' | 'Limpede' | 'Tulbure' | 'Foarte tulbure'
    level: 'Foarte scăzut' | 'Scăzut' | 'Normal' | 'Ridicat' | 'Foarte ridicat'
  }
  moonPhase?: string
  solunarRating?: number // 1-10
  notes: string
  photos: string[]
  rating: number // 1-5 stars for overall session
  public: boolean // Share with community
}

export interface JournalStats {
  totalSessions: number
  totalCatches: number
  totalWeight: number
  totalHours: number
  averageCatchesPerSession: number
  largestCatch: {
    species: string
    weight: number
    length: number
    date: Date
  }
  favoriteLocation: string
  favoriteSpecies: string
  bestMonth: string
  successRate: number // percentage of sessions with catches
  speciesCount: number // unique species caught
}

export interface JournalFilters {
  dateRange?: {
    start: Date
    end: Date
  }
  species?: string[]
  locations?: string[]
  techniques?: string[]
  minCatches?: number
  rating?: number[]
  weather?: string[]
  onlyWithCatches?: boolean
}

export type SortOption = 
  | 'date-desc' 
  | 'date-asc' 
  | 'catches-desc' 
  | 'catches-asc' 
  | 'rating-desc' 
  | 'rating-asc'

// Active session that's currently ongoing
export interface ActiveSession {
  id: string
  startDate: Date
  startTime: string // HH:MM
  location: {
    name: string
    coordinates?: {
      latitude: number
      longitude: number
    }
    waterBody: string
  }
  techniques: string[]
  baits: string[]
  weather: WeatherConditions
  waterConditions: {
    temperature?: number
    clarity: 'Foarte limpede' | 'Limpede' | 'Tulbure' | 'Foarte tulbure'
    level: 'Foarte scăzut' | 'Scăzut' | 'Normal' | 'Ridicat' | 'Foarte ridicat'
  }
  catches: FishCatch[]
  notes: string
  photos: string[]
}

export interface JournalEntry extends FishingSession {
  // Additional computed fields for display
  duration: number // minutes
  catchCount: number
  totalWeight: number
  biggestCatch?: FishCatch
  speciesVariety: number
}