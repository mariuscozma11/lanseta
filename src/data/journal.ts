import { FishingSession, FishCatch, WeatherConditions } from '../types/journal'

export const sampleJournalEntries: FishingSession[] = [
  {
    id: 'session-1',
    date: new Date('2024-08-20'),
    startTime: '06:00',
    endTime: '14:30',
    location: {
      name: 'Lacul Surduc',
      coordinates: {
        latitude: 45.6231,
        longitude: 21.8914
      },
      waterBody: 'Lac'
    },
    catches: [
      {
        id: 'catch-1',
        speciesId: 'carp-common',
        speciesName: 'Crap comun',
        length: 52,
        weight: 3.2,
        released: false,
        notes: 'Prins cu boilies la fund, luptă puternică'
      },
      {
        id: 'catch-2', 
        speciesId: 'carp-common',
        speciesName: 'Crap comun',
        length: 38,
        weight: 1.8,
        released: true,
        notes: 'Exemplar mic, eliberat pentru regenerare'
      }
    ],
    techniques: ['Method feeder', 'Bottom fishing'],
    baits: ['Boilies', 'Porumb'],
    weather: {
      temperature: 24,
      humidity: 65,
      pressure: 1018,
      windSpeed: 8,
      windDirection: 'NV',
      conditions: 'Parțial noros'
    },
    waterConditions: {
      temperature: 22,
      clarity: 'Limpede',
      level: 'Normal'
    },
    moonPhase: 'Lună plină',
    solunarRating: 8,
    notes: 'Sesiune excelentă la lacul Surduc. Peștii au fost activi dimineața devreme și după-amiaza târziu. Boilies cu aromă de căpșuni s-au dovedit foarte eficiente.',
    photos: [],
    rating: 5,
    public: true
  },
  {
    id: 'session-2',
    date: new Date('2024-08-15'),
    startTime: '19:00',
    endTime: '23:30',
    location: {
      name: 'Bega - zona Timișoara',
      coordinates: {
        latitude: 45.7489,
        longitude: 21.2087
      },
      waterBody: 'Râu'
    },
    catches: [
      {
        id: 'catch-3',
        speciesId: 'pike-northern',
        speciesName: 'Știucă',
        length: 68,
        weight: 2.8,
        released: true,
        notes: 'Prinsă cu spinning, wobler de 12cm'
      }
    ],
    techniques: ['Spinning', 'Pescuit cu momeli artificiale'],
    baits: ['Wobler', 'Shad'],
    weather: {
      temperature: 28,
      humidity: 58,
      pressure: 1021,
      windSpeed: 5,
      windDirection: 'E',
      conditions: 'Senin'
    },
    waterConditions: {
      temperature: 25,
      clarity: 'Tulbure',
      level: 'Scăzut'
    },
    moonPhase: 'Pătrarul trei',
    solunarRating: 6,
    notes: 'Pescuit seara pe Bega. Știuca a atacat wobblerul în zona cu vegetație. Luptă spectaculoasă, eliberată sănătoasă.',
    photos: [],
    rating: 4,
    public: true
  },
  {
    id: 'session-3',
    date: new Date('2024-08-10'),
    startTime: '05:30',
    endTime: '12:00',
    location: {
      name: 'Canalul Bega Veche',
      waterBody: 'Canal'
    },
    catches: [
      {
        id: 'catch-4',
        speciesId: 'perch-european',
        speciesName: 'Biban',
        length: 28,
        weight: 0.6,
        released: false,
        notes: 'Prins cu viermi la float'
      },
      {
        id: 'catch-5',
        speciesId: 'perch-european', 
        speciesName: 'Biban',
        length: 24,
        weight: 0.4,
        released: true,
        notes: 'Exemplar mic'
      },
      {
        id: 'catch-6',
        speciesId: 'roach-common',
        speciesName: 'Babușcă',
        length: 22,
        weight: 0.3,
        released: true,
        notes: 'Prima captură a dimineții'
      }
    ],
    techniques: ['Float fishing', 'Match fishing'],
    baits: ['Viermi', 'Porumb', 'Pâine'],
    weather: {
      temperature: 21,
      humidity: 78,
      pressure: 1015,
      windSpeed: 12,
      windDirection: 'SV',
      conditions: 'Noros'
    },
    waterConditions: {
      temperature: 19,
      clarity: 'Limpede',
      level: 'Normal'
    },
    moonPhase: 'Lună nouă',
    solunarRating: 4,
    notes: 'Dimineață răcoroasă pe canal. Peștii mici foarte activi. Bună sesiune pentru relaxare și antrenament.',
    photos: [],
    rating: 3,
    public: false
  },
  {
    id: 'session-4',
    date: new Date('2024-08-05'),
    startTime: '06:30',
    endTime: '11:00',
    location: {
      name: 'Lacul din Parcul Rozelor',
      waterBody: 'Lac'
    },
    catches: [],
    techniques: ['Float fishing'],
    baits: ['Viermi', 'Porumb'],
    weather: {
      temperature: 26,
      humidity: 45,
      pressure: 1025,
      windSpeed: 15,
      windDirection: 'N',
      conditions: 'Senin'
    },
    waterConditions: {
      temperature: 24,
      clarity: 'Foarte limpede',
      level: 'Scăzut'
    },
    moonPhase: 'Pătrarul doi',
    solunarRating: 3,
    notes: 'Sesiune fără captură. Vântul puternic și presiunea atmosferică ridicată au făcut peștii inactivi. Totuși, o dimineață frumoasă în parc.',
    photos: [],
    rating: 2,
    public: false
  },
  {
    id: 'session-5',
    date: new Date('2024-07-28'),
    startTime: '04:30',
    endTime: '10:30',
    location: {
      name: 'Balta Remetea',
      coordinates: {
        latitude: 45.8123,
        longitude: 21.1456
      },
      waterBody: 'Baltă'
    },
    catches: [
      {
        id: 'catch-7',
        speciesId: 'catfish-european',
        speciesName: 'Somn',
        length: 95,
        weight: 8.5,
        released: true,
        notes: 'Somn mare prins cu viermi la fund. Luptă de 20 de minute!'
      },
      {
        id: 'catch-8',
        speciesId: 'carp-common',
        speciesName: 'Crap comun',
        length: 44,
        weight: 2.1,
        released: false,
        notes: 'Crap frumos prins în același loc cu somnul'
      }
    ],
    techniques: ['Bottom fishing', 'Heavy feeder'],
    baits: ['Viermi mari', 'Boilies', 'Pellets'],
    weather: {
      temperature: 22,
      humidity: 82,
      pressure: 1012,
      windSpeed: 3,
      windDirection: 'SE',
      conditions: 'Parțial noros'
    },
    waterConditions: {
      temperature: 20,
      clarity: 'Tulbure',
      level: 'Ridicat'
    },
    moonPhase: 'Gibbous descrescător',
    solunarRating: 9,
    notes: 'Sesiune memorabilă la Remetea! Somnul a fost captura vieții mele până acum. Vremea perfectă pentru pescuit, ceață dimineață și calm total.',
    photos: [],
    rating: 5,
    public: true
  }
]

export const commonTechniques = [
  'Float fishing',
  'Bottom fishing',
  'Method feeder',
  'Spinning',
  'Carp rig',
  'Match fishing',
  'Heavy feeder',
  'Jigging',
  'Drop shot',
  'Trolling',
  'Fly fishing',
  'Pole fishing'
]

export const commonBaits = [
  'Viermi',
  'Porumb',
  'Boilies',
  'Pâine',
  'Pellets',
  'Wobler',
  'Shad',
  'Jigs',
  'Plicuțe',
  'Semințe',
  'Peștișori vii',
  'Momeală moartă',
  'Lipan',
  'Larve'
]

export const weatherConditions = [
  'Senin',
  'Parțial noros',
  'Noros',
  'Ploios',
  'Furtună'
]

export const waterClarityOptions = [
  'Foarte limpede',
  'Limpede', 
  'Tulbure',
  'Foarte tulbure'
]

export const waterLevelOptions = [
  'Foarte scăzut',
  'Scăzut',
  'Normal',
  'Ridicat',
  'Foarte ridicat'
]