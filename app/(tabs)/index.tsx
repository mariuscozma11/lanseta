import { StyleSheet, View, Alert } from 'react-native';
import { RomanianText } from '@/src/localization/ro';
import FishingMap from '@/src/components/FishingMap';
import { sampleFishingSpots } from '@/src/data/fishingSpots';
import { FishingSpot } from '@/src/types/database';

export default function MapScreen() {
  const handleSpotPress = (spot: FishingSpot) => {
    const priceText = spot.price ? `${spot.price} RON/zi` : 'Gratuit'
    const speciesText = spot.species.join(', ')
    
    Alert.alert(
      spot.name,
      `${spot.description}\n\n💰 Preț: ${priceText}\n🐟 Specii: ${speciesText}\n\n📋 Reguli:\n${spot.rules}`,
      [{ text: 'Închide', style: 'default' }]
    )
  }

  return (
    <View style={styles.container}>
      <FishingMap
        spots={sampleFishingSpots}
        onSpotPress={handleSpotPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
