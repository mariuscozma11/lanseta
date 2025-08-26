import { StyleSheet, Text, View } from 'react-native'

export default function SpeciesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Specii de pești</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})