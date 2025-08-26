import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/src/constants/Colors'
import { fishSpecies } from '@/src/data/species'
import { FishSpecies } from '@/src/types/species'
import SpeciesList from '@/src/components/SpeciesList'
import SpeciesDetailModal from '@/src/components/SpeciesDetailModal'

export default function SpeciesScreen() {
  const [selectedSpecies, setSelectedSpecies] = useState<FishSpecies | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  
  const handleSpeciesPress = (species: FishSpecies) => {
    setSelectedSpecies(species)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedSpecies(null)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SpeciesList 
        species={fishSpecies}
        onSpeciesPress={handleSpeciesPress}
      />
      
      <SpeciesDetailModal
        visible={modalVisible}
        species={selectedSpecies}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
})