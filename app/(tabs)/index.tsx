import { StyleSheet, Text, View } from 'react-native';
import { RomanianText } from '@/src/localization/ro';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{RomanianText.fishingSpots}</Text>
      <Text style={styles.subtitle}>Harta locurilor de pescuit din Timiș</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
