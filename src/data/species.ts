import { FishSpecies } from '../types/species'

export const fishSpecies: FishSpecies[] = [
  {
    id: 'carp-common',
    name: 'Common Carp',
    scientificName: 'Cyprinus carpio',
    romanianName: 'Crap comun',
    commonNames: ['Crap', 'Crap de baltă'],
    family: 'Cyprinidae',
    habitat: ['Lacuri', 'Bălți', 'Râuri lente', 'Canale'],
    size: {
      minLength: 30,
      maxLength: 120,
      averageWeight: 5.0
    },
    characteristics: {
      bodyShape: 'Corp înalt și comprimat lateral',
      coloration: 'Bronz-auriu cu reflexe verzui',
      distinctiveFeatures: ['4 barbițe la gură', 'Solzi mari', 'Înotătoarea dorsală lungă']
    },
    behavior: {
      feedingHabits: ['Omnivor', 'Hrănește de pe fund', 'Plante acvatice', 'Nevertebrate'],
      activity: 'diurnal',
      seasonalPatterns: 'Activ primăvara și toamna, mai puțin activ iarna'
    },
    fishingInfo: {
      bestBaits: ['Porumb', 'Boilies', 'Viermi', 'Lipan', 'Pâine'],
      techniques: ['Method feeder', 'Carp rig', 'Float fishing', 'Bottom fishing'],
      bestSeasons: ['Primăvara', 'Vara', 'Toamna'],
      difficulty: 'Mediu'
    },
    conservation: {
      status: 'Comun',
      regulations: ['Mărime minimă: 35cm', 'Perioada de prohibiție: 1 Mai - 15 Iunie']
    },
    description: 'Crapul comun este una dintre cele mai populare specii pentru pescuit în România. Este un pește robust, care poate trăi mulți ani și poate atinge dimensiuni impresionante. Preferă apele calde și hrănitoare, fiind foarte adaptat la condițiile din bălțile și lacurile din Timiș.'
  },
  {
    id: 'pike-northern',
    name: 'Northern Pike',
    scientificName: 'Esox lucius',
    romanianName: 'Știucă',
    commonNames: ['Știuca', 'Broscoi'],
    family: 'Esocidae',
    habitat: ['Râuri', 'Lacuri', 'Bălți cu vegetație'],
    size: {
      minLength: 40,
      maxLength: 150,
      averageWeight: 3.5
    },
    characteristics: {
      bodyShape: 'Corp alungit și fusiform',
      coloration: 'Verde cu dungi și pete mai închise',
      distinctiveFeatures: ['Botul lung și ascuțit', 'Dinți ascuțiți', 'Înotătoare dorsală înapoi']
    },
    behavior: {
      feedingHabits: ['Prădător', 'Pești mici', 'Broaște', 'Păsări acvatice mici'],
      activity: 'crepuscular',
      seasonalPatterns: 'Foarte activă primăvara și toamna, mai puțin vara'
    },
    fishingInfo: {
      bestBaits: ['Peștișori vii', 'Spinning lures', 'Momeală moartă', 'Wobler'],
      techniques: ['Spinning', 'Pescuit cu mort', 'Trolling', 'Fly fishing'],
      bestSeasons: ['Primăvara', 'Toamna'],
      difficulty: 'Greu'
    },
    conservation: {
      status: 'Moderat',
      regulations: ['Mărime minimă: 50cm', 'Perioada de prohibiție: 1 Martie - 30 Aprilie']
    },
    description: 'Știuca este regina prădătorilor din apele dulci românești. Un pește agresiv și puternic, știuca oferă lupte spectaculoase și este foarte apreciată de pescarii sportivi. Preferă zonele cu vegetație bogată unde își poate camufla atacurile.'
  },
  {
    id: 'zander-pikeperch',
    name: 'Zander',
    scientificName: 'Sander lucioperca',
    romanianName: 'Șalău',
    commonNames: ['Șalaul', 'Judecător'],
    family: 'Percidae',
    habitat: ['Râuri mari', 'Lacuri adânci', 'Canale'],
    size: {
      minLength: 30,
      maxLength: 100,
      averageWeight: 2.5
    },
    characteristics: {
      bodyShape: 'Corp alungit, comprimat lateral',
      coloration: 'Verde-bronz cu dungi transversale închise',
      distinctiveFeatures: ['Dinți canini mari', 'Ochii mari și vitroși', 'Două înotătoare dorsale']
    },
    behavior: {
      feedingHabits: ['Prădător', 'Pești mici', 'Crustacee', 'Larve'],
      activity: 'nocturnal',
      seasonalPatterns: 'Activ toată vara, mai puțin activ iarna'
    },
    fishingInfo: {
      bestBaits: ['Peștișori vii', 'Jigs', 'Shad-uri', 'Viermi'],
      techniques: ['Jigging', 'Spinning', 'Drop shot', 'Pescuit vertical'],
      bestSeasons: ['Vara', 'Toamna'],
      difficulty: 'Greu'
    },
    conservation: {
      status: 'Comun',
      regulations: ['Mărime minimă: 45cm', 'Perioada de prohibiție: 1 Aprilie - 31 Mai']
    },
    description: 'Șalaul este un prădător rafinat și inteligent, considerat una dintre cele mai savuroase specii de pești din apele noastre. Preferă apele mai adânci și clare, fiind foarte selectiv în privința hranei.'
  },
  {
    id: 'catfish-european',
    name: 'European Catfish',
    scientificName: 'Silurus glanis',
    romanianName: 'Somn',
    commonNames: ['Somnul', 'Râmă'],
    family: 'Siluridae',
    habitat: ['Râuri mari', 'Lacuri adânci', 'Gropi adânci'],
    size: {
      minLength: 60,
      maxLength: 300,
      averageWeight: 20.0
    },
    characteristics: {
      bodyShape: 'Corp masiv și alungit',
      coloration: 'Brun-verzui cu pete mai închise',
      distinctiveFeatures: ['6 barbițe lungi', 'Piele fără solzi', 'Gură foarte mare']
    },
    behavior: {
      feedingHabits: ['Prădător', 'Pești', 'Crustacee', 'Moluste', 'Chiar și păsări'],
      activity: 'nocturnal',
      seasonalPatterns: 'Foarte activ vara, letargic iarna'
    },
    fishingInfo: {
      bestBaits: ['Peștișori mari', 'Viermi mari', 'Calamar', 'Ficat'],
      techniques: ['Bottom fishing', 'Catfish rigs', 'Pescuit cu mort', 'Clonking'],
      bestSeasons: ['Vara', 'Începutul toamnei'],
      difficulty: 'Expert'
    },
    conservation: {
      status: 'Comun',
      regulations: ['Mărime minimă: 70cm', 'Fără perioadă de prohibiție']
    },
    description: 'Somnul este gigantul apelor dulci românești, putând atinge dimensiuni impresionante. Este un prădător oportunist și foarte puternic, oferind unele dintre cele mai spectaculoase lupte din pescuitul sportiv.'
  },
  {
    id: 'perch-european',
    name: 'European Perch',
    scientificName: 'Perca fluviatilis',
    romanianName: 'Biban',
    commonNames: ['Bibanul', 'Cocoș'],
    family: 'Percidae',
    habitat: ['Râuri', 'Lacuri', 'Bălți', 'Canale'],
    size: {
      minLength: 15,
      maxLength: 50,
      averageWeight: 0.8
    },
    characteristics: {
      bodyShape: 'Corp înalt și comprimat lateral',
      coloration: 'Verde cu 5-9 benzi transversale închise',
      distinctiveFeatures: ['Înotătoare roșii', 'Două înotătoare dorsale', 'Solzi aspri']
    },
    behavior: {
      feedingHabits: ['Prădător', 'Pești mici', 'Insecte', 'Crustacee', 'Viermi'],
      activity: 'diurnal',
      seasonalPatterns: 'Activ tot anul, format stoluri iarna'
    },
    fishingInfo: {
      bestBaits: ['Viermi', 'Plicuțe', 'Spinning mic', 'Larve'],
      techniques: ['Float fishing', 'Light spinning', 'Jig mic', 'Drop shot'],
      bestSeasons: ['Toată anul'],
      difficulty: 'Ușor'
    },
    conservation: {
      status: 'Comun',
      regulations: ['Mărime minimă: 15cm', 'Fără perioadă de prohibiție']
    },
    description: 'Bibanul este un pește foarte răspândit și popular printre pescari. Este ideal pentru începători datorită naturii sale agresive și a faptului că mușcă frecvent la diverse momeală.'
  },
  {
    id: 'roach-common',
    name: 'Common Roach',
    scientificName: 'Rutilus rutilus',
    romanianName: 'Babușcă',
    commonNames: ['Babușca', 'Roșioară'],
    family: 'Cyprinidae',
    habitat: ['Râuri lente', 'Lacuri', 'Bălți', 'Canale'],
    size: {
      minLength: 10,
      maxLength: 35,
      averageWeight: 0.5
    },
    characteristics: {
      bodyShape: 'Corp moderat comprimat lateral',
      coloration: 'Argintiu cu spatele mai închis',
      distinctiveFeatures: ['Înotătoare roșii-portocalii', 'Ochii roșii', 'Solzi argintii']
    },
    behavior: {
      feedingHabits: ['Omnivor', 'Plante acvatice', 'Insecte', 'Larve', 'Semințe'],
      activity: 'diurnal',
      seasonalPatterns: 'Format stoluri mari, activ tot anul'
    },
    fishingInfo: {
      bestBaits: ['Viermi', 'Porumb', 'Pâine', 'Semințe', 'Plicuțe'],
      techniques: ['Match fishing', 'Float fishing', 'Feeder', 'Pole fishing'],
      bestSeasons: ['Toată anul'],
      difficulty: 'Ușor'
    },
    conservation: {
      status: 'Comun',
      regulations: ['Fără restricții speciale']
    },
    description: 'Babușca este unul dintre peștii cei mai comuni din apele românești. Formează stoluri numeroase și este ideală pentru pescuitul de relaxare și pentru începători.'
  }
]

export const speciesFamilies = [
  'Cyprinidae',
  'Esocidae', 
  'Percidae',
  'Siluridae'
]

export const habitatTypes = [
  'Râuri',
  'Râuri lente',
  'Râuri mari', 
  'Lacuri',
  'Lacuri adânci',
  'Bălți',
  'Canale',
  'Vegetație bogată',
  'Gropi adânci'
]

export const difficultyLevels = [
  'Ușor',
  'Mediu', 
  'Greu',
  'Expert'
]

export const seasons = [
  'Primăvara',
  'Vara',
  'Toamna',
  'Iarna'
]