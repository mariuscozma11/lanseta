export interface FishSpecies {
  id: string
  name: string
  scientificName: string
  romanianName: string
  commonNames: string[]
  family: string
  habitat: string[]
  size: {
    minLength: number // cm
    maxLength: number // cm
    averageWeight: number // kg
  }
  characteristics: {
    bodyShape: string
    coloration: string
    distinctiveFeatures: string[]
  }
  behavior: {
    feedingHabits: string[]
    activity: 'diurnal' | 'nocturnal' | 'crepuscular' | 'variable'
    seasonalPatterns: string
  }
  fishingInfo: {
    bestBaits: string[]
    techniques: string[]
    bestSeasons: string[]
    difficulty: 'Ușor' | 'Mediu' | 'Greu' | 'Expert'
  }
  conservation: {
    status: 'Comun' | 'Moderat' | 'Rar' | 'Protejat'
    regulations: string[]
  }
  image?: string
  description: string
}

export interface SpeciesFilters {
  family?: string
  habitat?: string[]
  difficulty?: string[]
  season?: string[]
  size?: 'small' | 'medium' | 'large'
}