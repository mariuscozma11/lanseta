import React, { useEffect } from 'react'
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { BlurView } from 'expo-blur'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { FishSpecies } from '../types/species'
import { Colors } from '../constants/Colors'

interface SpeciesDetailModalProps {
  visible: boolean
  species: FishSpecies | null
  onClose: () => void
}

const { height: screenHeight } = Dimensions.get('window')

export default function SpeciesDetailModal({ visible, species, onClose }: SpeciesDetailModalProps) {
  const translateY = useSharedValue(screenHeight)
  const opacity = useSharedValue(0)
  
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: { startY: number }) => {
      context.startY = translateY.value
    },
    onActive: (event, context: { startY: number }) => {
      const newTranslateY = context.startY + event.translationY
      translateY.value = Math.max(0, newTranslateY)
    },
    onEnd: (event) => {
      if (event.translationY > 80 || event.velocityY > 500) {
        translateY.value = withTiming(screenHeight, { duration: 250 })
        opacity.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(onClose)()
        })
      } else {
        translateY.value = withTiming(0, { duration: 250 })
      }
    },
  })

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 })
      translateY.value = withTiming(0, { duration: 300 })
    } else {
      translateY.value = screenHeight
      opacity.value = 0
    }
  }, [visible])

  const closeModal = () => {
    translateY.value = withTiming(screenHeight, { duration: 250 })
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(onClose)()
    })
  }

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }))

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  if (!species) return null

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Ușor': return Colors.secondary.lightGreen
      case 'Mediu': return Colors.warning.orange
      case 'Greu': return Colors.error.red
      case 'Expert': return Colors.neutral.black
      default: return Colors.light.border
    }
  }

  const getConservationColor = (status: string) => {
    switch (status) {
      case 'Comun': return Colors.secondary.lightGreen
      case 'Moderat': return Colors.warning.orange
      case 'Rar': return Colors.error.red
      case 'Protejat': return Colors.neutral.black
      default: return Colors.light.border
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={closeModal}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
          <BlurView intensity={20} style={StyleSheet.absoluteFillObject} />
          <TouchableOpacity 
            style={StyleSheet.absoluteFillObject} 
            onPress={closeModal}
            activeOpacity={1}
          />
        </Animated.View>
        
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View 
            style={[styles.modalContainer, modalAnimatedStyle]}
          >
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
            
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <View style={[
                  styles.speciesIndicator,
                  { backgroundColor: getDifficultyColor(species.fishingInfo.difficulty) }
                ]}>
                  <Ionicons name="fish" size={24} color={Colors.neutral.white} />
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.speciesName}>{species.romanianName}</Text>
                  <Text style={styles.scientificName}>{species.scientificName}</Text>
                  <View style={styles.statusContainer}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getConservationColor(species.conservation.status) }
                    ]}>
                      <Text style={styles.statusText}>{species.conservation.status}</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name="close" size={18} color={Colors.light.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="information-circle" size={18} color={Colors.primary.blue} />
                  <Text style={styles.sectionTitle}>Descriere</Text>
                </View>
                <Text style={styles.description}>{species.description}</Text>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="resize" size={18} color={Colors.primary.blue} />
                  <Text style={styles.sectionTitle}>Dimensiuni</Text>
                </View>
                <View style={styles.sizeInfo}>
                  <Text style={styles.sizeText}>
                    Lungime: {species.size.minLength}-{species.size.maxLength} cm
                  </Text>
                  <Text style={styles.sizeText}>
                    Greutate medie: {species.size.averageWeight} kg
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="eye" size={18} color={Colors.primary.blue} />
                  <Text style={styles.sectionTitle}>Caracteristici</Text>
                </View>
                <Text style={styles.characteristicText}>
                  <Text style={styles.label}>Forma corpului:</Text> {species.characteristics.bodyShape}
                </Text>
                <Text style={styles.characteristicText}>
                  <Text style={styles.label}>Colorație:</Text> {species.characteristics.coloration}
                </Text>
                <View style={styles.featuresContainer}>
                  {species.characteristics.distinctiveFeatures.map((feature, index) => (
                    <View key={index} style={styles.featureTag}>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="location" size={18} color={Colors.primary.blue} />
                  <Text style={styles.sectionTitle}>Habitat</Text>
                </View>
                <View style={styles.habitatContainer}>
                  {species.habitat.map((hab, index) => (
                    <View key={index} style={styles.habitatTag}>
                      <Text style={styles.habitatText}>{hab}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="fish" size={18} color={Colors.primary.blue} />
                  <Text style={styles.sectionTitle}>Informații Pescuit</Text>
                </View>
                
                <Text style={styles.fishingLabel}>Dificultate:</Text>
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(species.fishingInfo.difficulty) }
                ]}>
                  <Text style={styles.difficultyText}>{species.fishingInfo.difficulty}</Text>
                </View>

                <Text style={styles.fishingLabel}>Momeală recomandată:</Text>
                <View style={styles.baitsContainer}>
                  {species.fishingInfo.bestBaits.map((bait, index) => (
                    <View key={index} style={styles.baitTag}>
                      <Text style={styles.baitText}>{bait}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.fishingLabel}>Tehnici:</Text>
                <View style={styles.techniquesContainer}>
                  {species.fishingInfo.techniques.map((technique, index) => (
                    <View key={index} style={styles.techniqueTag}>
                      <Text style={styles.techniqueText}>{technique}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.fishingLabel}>Sezoane optime:</Text>
                <View style={styles.seasonsContainer}>
                  {species.fishingInfo.bestSeasons.map((season, index) => (
                    <View key={index} style={styles.seasonTag}>
                      <Text style={styles.seasonText}>{season}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {species.conservation.regulations.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <MaterialIcons name="rule" size={18} color={Colors.error.red} />
                    <Text style={[styles.sectionTitle, { color: Colors.error.red }]}>
                      Reglementări
                    </Text>
                  </View>
                  <View style={styles.regulationsContainer}>
                    {species.conservation.regulations.map((regulation, index) => (
                      <View key={index} style={styles.regulationItem}>
                        <Ionicons name="warning" size={16} color={Colors.error.red} />
                        <Text style={styles.regulationText}>{regulation}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: screenHeight * 0.85,
    paddingTop: 12,
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: Colors.light.textSecondary,
    borderRadius: 3,
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  speciesIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  speciesName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 2,
    lineHeight: 26,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  statusContainer: {
    alignSelf: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.neutral.white,
    textTransform: 'uppercase',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.blue,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.light.text,
  },
  sizeInfo: {
    gap: 4,
  },
  sizeText: {
    fontSize: 15,
    color: Colors.light.text,
  },
  characteristicText: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  label: {
    fontWeight: '600',
    color: Colors.primary.blue,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  featureTag: {
    backgroundColor: Colors.secondary.lightGreen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  habitatContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  habitatTag: {
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  habitatText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  fishingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.blue,
    marginTop: 12,
    marginBottom: 8,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  baitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  baitTag: {
    backgroundColor: Colors.warning.lightOrange,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  baitText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  techniquesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  techniqueTag: {
    backgroundColor: Colors.primary.lightBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  techniqueText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  seasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  seasonTag: {
    backgroundColor: Colors.secondary.lightGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  seasonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  regulationsContainer: {
    backgroundColor: Colors.error.lightRed,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error.red,
  },
  regulationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  regulationText: {
    fontSize: 14,
    color: Colors.error.red,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
})