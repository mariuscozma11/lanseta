import { FishingSession, JournalStats } from '../types/journal'

export const calculateJournalStats = (sessions: FishingSession[]): JournalStats => {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalCatches: 0,
      totalWeight: 0,
      totalHours: 0,
      averageCatchesPerSession: 0,
      largestCatch: {
        species: '',
        weight: 0,
        length: 0,
        date: new Date()
      },
      favoriteLocation: '',
      favoriteSpecies: '',
      bestMonth: '',
      successRate: 0,
      speciesCount: 0
    }
  }

  // Calculate total duration
  const totalMinutes = sessions.reduce((sum, session) => {
    const startTime = new Date(`1970-01-01T${session.startTime}:00`)
    const endTime = new Date(`1970-01-01T${session.endTime}:00`)
    return sum + (endTime.getTime() - startTime.getTime()) / (1000 * 60)
  }, 0)

  // Calculate catches
  const allCatches = sessions.flatMap(session => session.catches)
  const totalCatches = allCatches.length
  const totalWeight = allCatches.reduce((sum, catch_) => sum + catch_.weight, 0)

  // Find largest catch
  const largestCatch = allCatches.reduce((max, catch_) => {
    if (catch_.weight > max.weight) {
      return {
        species: catch_.speciesName,
        weight: catch_.weight,
        length: catch_.length,
        date: sessions.find(s => s.catches.some(c => c.id === catch_.id))?.date || new Date()
      }
    }
    return max
  }, { species: '', weight: 0, length: 0, date: new Date() })

  // Calculate location frequency
  const locationCounts = sessions.reduce((acc, session) => {
    acc[session.location.name] = (acc[session.location.name] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const favoriteLocation = Object.entries(locationCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || ''

  // Calculate species frequency
  const speciesCounts = allCatches.reduce((acc, catch_) => {
    acc[catch_.speciesName] = (acc[catch_.speciesName] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const favoriteSpecies = Object.entries(speciesCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || ''

  // Calculate best month
  const monthCounts = sessions.reduce((acc, session) => {
    const month = new Date(session.date).getMonth()
    const monthNames = [
      'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ]
    const monthName = monthNames[month]
    acc[monthName] = (acc[monthName] || 0) + session.catches.length
    return acc
  }, {} as Record<string, number>)

  const bestMonth = Object.entries(monthCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || ''

  // Calculate success rate (sessions with at least 1 catch)
  const successfulSessions = sessions.filter(s => s.catches.length > 0).length
  const successRate = sessions.length > 0 ? (successfulSessions / sessions.length) * 100 : 0

  // Count unique species
  const uniqueSpecies = new Set(allCatches.map(c => c.speciesId))
  const speciesCount = uniqueSpecies.size

  return {
    totalSessions: sessions.length,
    totalCatches,
    totalWeight,
    totalHours: totalMinutes / 60,
    averageCatchesPerSession: totalCatches / sessions.length,
    largestCatch,
    favoriteLocation,
    favoriteSpecies,
    bestMonth,
    successRate,
    speciesCount
  }
}

export const getMonthlyStats = (sessions: FishingSession[]) => {
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthNames = [
      'Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun',
      'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'
    ]
    return {
      month: monthNames[i],
      sessions: 0,
      catches: 0,
      weight: 0
    }
  })

  sessions.forEach(session => {
    const month = new Date(session.date).getMonth()
    monthlyData[month].sessions++
    monthlyData[month].catches += session.catches.length
    monthlyData[month].weight += session.catches.reduce((sum, c) => sum + c.weight, 0)
  })

  return monthlyData
}

export const getSpeciesStats = (sessions: FishingSession[]) => {
  const speciesData: Record<string, { count: number; weight: number; avgLength: number }> = {}

  sessions.forEach(session => {
    session.catches.forEach(catch_ => {
      if (!speciesData[catch_.speciesName]) {
        speciesData[catch_.speciesName] = { count: 0, weight: 0, avgLength: 0 }
      }
      speciesData[catch_.speciesName].count++
      speciesData[catch_.speciesName].weight += catch_.weight
    })
  })

  // Calculate average length for each species
  Object.keys(speciesData).forEach(species => {
    const catches = sessions.flatMap(s => s.catches).filter(c => c.speciesName === species)
    const totalLength = catches.reduce((sum, c) => sum + c.length, 0)
    speciesData[species].avgLength = totalLength / catches.length
  })

  return Object.entries(speciesData)
    .map(([species, data]) => ({ species, ...data }))
    .sort((a, b) => b.count - a.count)
}

export const getLocationStats = (sessions: FishingSession[]) => {
  const locationData: Record<string, { sessions: number; catches: number; successRate: number }> = {}

  sessions.forEach(session => {
    if (!locationData[session.location.name]) {
      locationData[session.location.name] = { sessions: 0, catches: 0, successRate: 0 }
    }
    locationData[session.location.name].sessions++
    locationData[session.location.name].catches += session.catches.length
  })

  // Calculate success rate for each location
  Object.keys(locationData).forEach(location => {
    const locationSessions = sessions.filter(s => s.location.name === location)
    const successfulSessions = locationSessions.filter(s => s.catches.length > 0).length
    locationData[location].successRate = (successfulSessions / locationSessions.length) * 100
  })

  return Object.entries(locationData)
    .map(([location, data]) => ({ location, ...data }))
    .sort((a, b) => b.catches - a.catches)
}

export const getTechniqueStats = (sessions: FishingSession[]) => {
  const techniqueData: Record<string, { sessions: number; catches: number; avgCatchesPerSession: number }> = {}

  sessions.forEach(session => {
    session.techniques.forEach(technique => {
      if (!techniqueData[technique]) {
        techniqueData[technique] = { sessions: 0, catches: 0, avgCatchesPerSession: 0 }
      }
      techniqueData[technique].sessions++
      techniqueData[technique].catches += session.catches.length
    })
  })

  // Calculate average catches per session for each technique
  Object.keys(techniqueData).forEach(technique => {
    techniqueData[technique].avgCatchesPerSession = 
      techniqueData[technique].catches / techniqueData[technique].sessions
  })

  return Object.entries(techniqueData)
    .map(([technique, data]) => ({ technique, ...data }))
    .sort((a, b) => b.avgCatchesPerSession - a.avgCatchesPerSession)
}