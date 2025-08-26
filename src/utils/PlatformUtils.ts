import { Platform } from 'react-native'

export const isWeb = Platform.OS === 'web'
export const isMobile = Platform.OS === 'ios' || Platform.OS === 'android'

export const getMapComponent = () => {
  if (isWeb) {
    return require('../components/FishingMap.web').default
  }
  return require('../components/FishingMap').default
}