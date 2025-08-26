import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native'
import { BlurView } from 'expo-blur'
import { FishingSpot } from '../types/database'
import { Colors } from '../constants/Colors'
import { RomanianText } from '../localization/ro'

interface FishingSpotModalProps {
  visible: boolean
  spot: FishingSpot | null
  onClose: () => void
}

const { height: screenHeight } = Dimensions.get('window')

export default function FishingSpotModal({ visible, spot, onClose }: FishingSpotModalProps) {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 20
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          closeModal()
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        }
      },
    })
  ).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start()
    } else {
      slideAnim.setValue(screenHeight)
      fadeAnim.setValue(0)
    }
  }, [visible])

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(() => {
      onClose()
    })
  }

  if (!spot) return null

  const isFree = spot.price === 0 || spot.price === null || spot.price === undefined
  const isPremium = spot.price && spot.price >= 25

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={closeModal}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <BlurView intensity={20} style={StyleSheet.absoluteFillObject} />
          <TouchableOpacity 
            style={StyleSheet.absoluteFillObject} 
            onPress={closeModal}
            activeOpacity={1}
          />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
          
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={[
                styles.spotTypeIndicator,
                isFree ? styles.freeIndicator : isPremium ? styles.premiumIndicator : styles.paidIndicator
              ]}>
                <Text style={styles.spotIcon}>🎣</Text>
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.spotName}>{spot.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={[
                    styles.priceText,
                    isFree ? styles.freePriceText : isPremium ? styles.premiumPriceText : styles.paidPriceText
                  ]}>
                    {isFree ? 'GRATUIT' : `${spot.price} RON/zi`}
                  </Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📍 {RomanianText.description}</Text>
              <Text style={styles.description}>{spot.description}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🐟 {RomanianText.presentSpecies}</Text>
              <View style={styles.speciesContainer}>
                {spot.species.map((species, index) => (
                  <View key={index} style={styles.speciesTag}>
                    <Text style={styles.speciesText}>{species}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 {RomanianText.rules}</Text>
              <Text style={styles.rulesText}>{spot.rules}</Text>
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>📍 Vezi pe Hartă</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>⭐ Adaugă la Favorite</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
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
    height: screenHeight * 0.78,
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
    paddingBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.light.border,
    borderRadius: 2,
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
  spotTypeIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  freeIndicator: {
    backgroundColor: Colors.map.freeSpot,
  },
  paidIndicator: {
    backgroundColor: Colors.map.paidSpot,
  },
  premiumIndicator: {
    backgroundColor: Colors.map.premiumSpot,
  },
  spotIcon: {
    fontSize: 24,
  },
  titleContainer: {
    flex: 1,
  },
  spotName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
    lineHeight: 26,
  },
  priceContainer: {
    alignSelf: 'flex-start',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  freePriceText: {
    backgroundColor: Colors.map.freeSpot,
    color: Colors.neutral.white,
  },
  paidPriceText: {
    backgroundColor: Colors.map.paidSpot,
    color: Colors.neutral.white,
  },
  premiumPriceText: {
    backgroundColor: Colors.map.premiumSpot,
    color: Colors.neutral.white,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.blue,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.light.text,
  },
  speciesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  speciesTag: {
    backgroundColor: Colors.secondary.lightGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  speciesText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  rulesText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.primary.blue,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.blue,
  },
})