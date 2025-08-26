import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '@/src/constants/Colors'
import { RomanianText } from '@/src/localization/ro'

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{RomanianText.profile}</Text>
      <Text style={styles.subtitle}>În curând - profil utilizator și setări</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary.blue,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
})