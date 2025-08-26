export interface FishingSpot {
  id: string
  name: string
  description?: string
  rules?: string
  price?: number
  species: string[]
  latitude: number
  longitude: number
  created_at: string
}

export interface Species {
  id: string
  name_ro: string
  name_latin?: string
  description_ro?: string
  rigs: string[]
  methods: string[]
  baits: string[]
  guidance?: string
  created_at: string
}

export interface FishingJournalEntry {
  id: string
  user_id: string
  species_id?: string
  spot_id?: string
  catch_date: string
  bait?: string
  method?: string
  rig?: string
  notes?: string
  created_at: string
}

export interface SolunarScore {
  id: string
  date: string
  location: string
  hourly_scores: number[]
  daily_score: number
}