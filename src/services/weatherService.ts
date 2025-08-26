import * as Location from 'expo-location'

// Using OpenWeatherMap API - free tier allows 1000 calls/day
const WEATHER_API_KEY = 'your_openweather_api_key' // Would be in environment variables in production
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

export interface WeatherData {
  temperature: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: string
  conditions: string
  description: string
  icon: string
}

// Convert wind direction from degrees to Romanian cardinal directions
const getWindDirection = (degrees: number): string => {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSV', 'SV', 'VSV',
    'V', 'VNV', 'NV', 'NNV'
  ]
  
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

// Convert OpenWeather condition codes to Romanian
const getConditionInRomanian = (weatherId: number, description: string): string => {
  // Based on OpenWeatherMap weather condition codes
  if (weatherId >= 200 && weatherId < 300) return 'Furtună'
  if (weatherId >= 300 && weatherId < 400) return 'Burniță'
  if (weatherId >= 500 && weatherId < 600) return 'Ploios'
  if (weatherId >= 600 && weatherId < 700) return 'Ninsoare'
  if (weatherId >= 700 && weatherId < 800) return 'Ceață'
  if (weatherId === 800) return 'Senin'
  if (weatherId === 801) return 'Parțial noros'
  if (weatherId >= 802) return 'Noros'
  
  // Fallback to translated description
  return description.charAt(0).toUpperCase() + description.slice(1)
}

export const getCurrentWeather = async (latitude?: number, longitude?: number): Promise<WeatherData | null> => {
  try {
    let lat = latitude
    let lon = longitude

    // If no coordinates provided, try to get current location
    if (!lat || !lon) {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        // Fallback to Timisoara coordinates
        lat = 45.7489
        lon = 21.2087
      } else {
        const location = await Location.getCurrentPositionAsync({})
        lat = location.coords.latitude
        lon = location.coords.longitude
      }
    }

    // For demo purposes, return mock weather data
    // In production, you would make the actual API call:
    /*
    const response = await fetch(
      `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=ro`
    )
    
    if (!response.ok) {
      throw new Error('Weather API request failed')
    }
    
    const data = await response.json()
    */

    // Mock weather data for Timis county
    const mockWeatherData: WeatherData = {
      temperature: Math.round(15 + Math.random() * 20), // 15-35°C
      humidity: Math.round(40 + Math.random() * 40), // 40-80%
      pressure: Math.round(1000 + Math.random() * 40), // 1000-1040 mbar
      windSpeed: Math.round(Math.random() * 20), // 0-20 km/h
      windDirection: getWindDirection(Math.random() * 360),
      conditions: ['Senin', 'Parțial noros', 'Noros'][Math.floor(Math.random() * 3)],
      description: 'Condiții bune pentru pescuit',
      icon: '01d' // Would be from API response
    }

    return mockWeatherData

    /*
    // Real API implementation:
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: getWindDirection(data.wind.deg),
      conditions: getConditionInRomanian(data.weather[0].id, data.weather[0].description),
      description: data.weather[0].description,
      icon: data.weather[0].icon
    }
    */

  } catch (error) {
    console.error('Weather service error:', error)
    return null
  }
}

export const getWeatherIcon = (conditions: string): string => {
  switch (conditions) {
    case 'Senin': return 'sunny'
    case 'Parțial noros': return 'partly-sunny'
    case 'Noros': return 'cloudy'
    case 'Ploios': return 'rainy'
    case 'Burniță': return 'rainy'
    case 'Furtună': return 'thunderstorm'
    case 'Ninsoare': return 'snow'
    case 'Ceață': return 'cloudy'
    default: return 'partly-sunny'
  }
}

// Get fishing conditions based on weather
export const getFishingConditions = (weather: WeatherData): {
  rating: 'Excelent' | 'Bun' | 'Moderat' | 'Slab'
  tips: string[]
  color: string
} => {
  let score = 0
  const tips: string[] = []

  // Temperature scoring (optimal 15-25°C)
  if (weather.temperature >= 15 && weather.temperature <= 25) {
    score += 3
  } else if (weather.temperature >= 10 && weather.temperature <= 30) {
    score += 2
    if (weather.temperature < 15) tips.push('Temperatura scăzută - peștii sunt mai puțin activi')
    if (weather.temperature > 25) tips.push('Temperatură ridicată - pescuiește dimineața sau seara')
  } else {
    score += 1
    tips.push('Temperatură extremă - condiții dificile pentru pescuit')
  }

  // Pressure scoring (optimal 1015-1025 mbar)
  if (weather.pressure >= 1015 && weather.pressure <= 1025) {
    score += 2
    tips.push('Presiune stabilă - peștii sunt activi')
  } else if (weather.pressure < 1010) {
    score += 1
    tips.push('Presiune scăzută - vremea se schimbă, pescuiește rapid')
  } else {
    score += 1
  }

  // Wind scoring
  if (weather.windSpeed <= 10) {
    score += 2
  } else if (weather.windSpeed <= 20) {
    score += 1
    tips.push('Vânt moderat - folosește momeli mai grele')
  } else {
    tips.push('Vânt puternic - condiții dificile')
  }

  // Weather conditions
  if (weather.conditions === 'Senin' || weather.conditions === 'Parțial noros') {
    score += 1
  } else if (weather.conditions === 'Ploios') {
    tips.push('Ploaie - peștii pot fi mai activi, dar fii precaut')
  } else if (weather.conditions === 'Furtună') {
    tips.push('Furtună - NU pescui! Pericol!')
    score = 0
  }

  if (tips.length === 0) {
    tips.push('Condiții bune pentru pescuit')
  }

  let rating: 'Excelent' | 'Bun' | 'Moderat' | 'Slab'
  let color: string

  if (score >= 7) {
    rating = 'Excelent'
    color = '#4CAF50'
  } else if (score >= 5) {
    rating = 'Bun'
    color = '#8BC34A'
  } else if (score >= 3) {
    rating = 'Moderat'
    color = '#FF9800'
  } else {
    rating = 'Slab'
    color = '#F44336'
  }

  return { rating, tips, color }
}