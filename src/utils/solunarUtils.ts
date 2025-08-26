// Solunar calculation utilities for Romanian fishing app
// Based on astronomical calculations for moon phases and sun times

export interface MoonPhase {
  phase: number // 0-1 where 0 = new moon, 0.5 = full moon
  phaseName: string
  illumination: number // 0-100 percentage
  emoji: string
}

export interface SunTimes {
  sunrise: Date
  sunset: Date
  dayLength: number // hours
}

export interface SolunarData {
  date: Date
  moonPhase: MoonPhase
  sunTimes: SunTimes
  dailyScore: number // 0-100
  hourlyScores: number[] // 24 hourly scores
  bestTimes: { hour: number; score: number }[]
}

// Timisoara coordinates
const TIMISOARA_LAT = 45.7489
const TIMISOARA_LON = 21.2087

/**
 * Calculate moon phase for a given date
 * Uses lunar cycle of 29.53 days
 */
export function calculateMoonPhase(date: Date): MoonPhase {
  // Known new moon: January 11, 2024
  const knownNewMoon = new Date('2024-01-11T00:00:00Z')
  const lunarCycle = 29.530588853 // days
  
  const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24)
  const cyclePosition = (daysSinceNewMoon % lunarCycle) / lunarCycle
  
  let phaseName: string
  let emoji: string
  
  if (cyclePosition < 0.03 || cyclePosition > 0.97) {
    phaseName = 'Lună nouă'
    emoji = '🌑'
  } else if (cyclePosition < 0.22) {
    phaseName = 'Semilună crescătoare'
    emoji = '🌒'
  } else if (cyclePosition < 0.28) {
    phaseName = 'Primul pătrar'
    emoji = '🌓'
  } else if (cyclePosition < 0.47) {
    phaseName = 'Lună crescătoare'
    emoji = '🌔'
  } else if (cyclePosition < 0.53) {
    phaseName = 'Lună plină'
    emoji = '🌕'
  } else if (cyclePosition < 0.72) {
    phaseName = 'Lună descrescătoare'
    emoji = '🌖'
  } else if (cyclePosition < 0.78) {
    phaseName = 'Ultimul pătrar'
    emoji = '🌗'
  } else {
    phaseName = 'Semilună descrescătoare'
    emoji = '🌘'
  }
  
  const illumination = Math.round(50 * (1 + Math.cos(2 * Math.PI * cyclePosition)))
  
  return {
    phase: cyclePosition,
    phaseName,
    illumination,
    emoji
  }
}

/**
 * Calculate sunrise and sunset times for Timisoara
 * Simplified calculation for Romanian latitude
 */
export function calculateSunTimes(date: Date): SunTimes {
  const dayOfYear = getDayOfYear(date)
  const lat = TIMISOARA_LAT * Math.PI / 180 // Convert to radians
  
  // Solar declination angle
  const declination = 23.45 * Math.PI / 180 * Math.sin(2 * Math.PI * (284 + dayOfYear) / 365)
  
  // Hour angle
  const hourAngle = Math.acos(-Math.tan(lat) * Math.tan(declination))
  
  // Sunrise and sunset in decimal hours (UTC)
  const sunriseUTC = 12 - hourAngle * 12 / Math.PI - TIMISOARA_LON / 15
  const sunsetUTC = 12 + hourAngle * 12 / Math.PI - TIMISOARA_LON / 15
  
  // Convert to local time (Romania is UTC+2, UTC+3 in summer)
  const isDST = isDaylightSaving(date)
  const offset = isDST ? 3 : 2
  
  const sunrise = new Date(date)
  sunrise.setUTCHours(Math.floor(sunriseUTC + offset), (sunriseUTC + offset) % 1 * 60)
  
  const sunset = new Date(date)
  sunset.setUTCHours(Math.floor(sunsetUTC + offset), (sunsetUTC + offset) % 1 * 60)
  
  const dayLength = (sunset.getTime() - sunrise.getTime()) / (1000 * 60 * 60)
  
  return {
    sunrise,
    sunset,
    dayLength
  }
}

/**
 * Calculate solunar score based on moon phase and sun times
 * Romanian fishing folklore integrated with astronomical data
 */
export function calculateSolunarScore(date: Date): SolunarData {
  const moonPhase = calculateMoonPhase(date)
  const sunTimes = calculateSunTimes(date)
  
  // Base score from moon phase (Romanian fishing wisdom)
  let moonScore = 0
  if (moonPhase.phase < 0.1 || moonPhase.phase > 0.9) {
    moonScore = 95 // New moon - excellent for fishing
  } else if (moonPhase.phase > 0.4 && moonPhase.phase < 0.6) {
    moonScore = 90 // Full moon - also excellent
  } else if (moonPhase.phase < 0.3 || moonPhase.phase > 0.7) {
    moonScore = 75 // Quarter moons - good
  } else {
    moonScore = 60 // In between phases - moderate
  }
  
  // Calculate hourly scores
  const hourlyScores: number[] = []
  const bestTimes: { hour: number; score: number }[] = []
  
  for (let hour = 0; hour < 24; hour++) {
    let hourScore = moonScore * 0.6 // Base from moon
    
    // Prime times: dawn and dusk
    const sunriseHour = sunTimes.sunrise.getHours()
    const sunsetHour = sunTimes.sunset.getHours()
    
    if (Math.abs(hour - sunriseHour) <= 1) {
      hourScore += 30 // Dawn boost
    }
    if (Math.abs(hour - sunsetHour) <= 1) {
      hourScore += 25 // Dusk boost
    }
    
    // Night fishing bonus for certain moon phases
    if ((hour < 6 || hour > 20) && (moonPhase.phase < 0.2 || moonPhase.phase > 0.8)) {
      hourScore += 15
    }
    
    // Day fishing penalty in full daylight
    if (hour > 10 && hour < 16) {
      hourScore -= 20
    }
    
    hourScore = Math.max(0, Math.min(100, hourScore))
    hourlyScores.push(Math.round(hourScore))
    
    if (hourScore > 75) {
      bestTimes.push({ hour, score: Math.round(hourScore) })
    }
  }
  
  // Daily score is average of best 6 hours
  const sortedScores = [...hourlyScores].sort((a, b) => b - a)
  const dailyScore = Math.round(sortedScores.slice(0, 6).reduce((a, b) => a + b, 0) / 6)
  
  // Sort best times by score
  bestTimes.sort((a, b) => b.score - a.score)
  
  return {
    date,
    moonPhase,
    sunTimes,
    dailyScore,
    hourlyScores,
    bestTimes: bestTimes.slice(0, 4) // Top 4 hours
  }
}

// Helper functions
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function isDaylightSaving(date: Date): boolean {
  // Romania DST: last Sunday in March to last Sunday in October
  const year = date.getFullYear()
  
  // Last Sunday in March
  const march = new Date(year, 2, 31)
  const marchLastSunday = new Date(march.getTime() - (march.getDay() * 24 * 60 * 60 * 1000))
  
  // Last Sunday in October  
  const october = new Date(year, 9, 31)
  const octoberLastSunday = new Date(october.getTime() - (october.getDay() * 24 * 60 * 60 * 1000))
  
  return date >= marchLastSunday && date < octoberLastSunday
}