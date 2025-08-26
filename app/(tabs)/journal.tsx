import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/src/constants/Colors'
import { sampleJournalEntries } from '@/src/data/journal'
import { FishingSession, ActiveSession, FishCatch } from '@/src/types/journal'
import JournalList from '@/src/components/JournalList'
import JournalStats from '@/src/components/JournalStats'
import StartSessionForm from '@/src/components/StartSessionForm'
import ActiveSessionView from '@/src/components/ActiveSessionView'
import AddCatchForm from '@/src/components/AddCatchForm'
import SessionDetailModal from '@/src/components/SessionDetailModal'

type TabType = 'journal' | 'stats'

export default function JournalScreen() {
  const [selectedSession, setSelectedSession] = useState<FishingSession | null>(null)
  const [showSessionDetail, setShowSessionDetail] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('journal')
  const [showStartForm, setShowStartForm] = useState(false)
  const [showAddCatchForm, setShowAddCatchForm] = useState(false)
  const [sessions, setSessions] = useState(sampleJournalEntries)
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null)

  const handleSessionPress = (session: FishingSession) => {
    setSelectedSession(session)
    setShowSessionDetail(true)
  }

  const handleCloseSessionDetail = () => {
    setShowSessionDetail(false)
    setSelectedSession(null)
  }

  const handleDeleteSession = (sessionToDelete: FishingSession) => {
    setSessions(prev => prev.filter(session => session.id !== sessionToDelete.id))
  }

  const handleAddPress = () => {
    if (activeSession) {
      // Already have active session, shouldn't happen
      return
    }
    setShowStartForm(true)
  }

  const handleStartSession = (newActiveSession: ActiveSession) => {
    setActiveSession(newActiveSession)
    setShowStartForm(false)
  }

  const handleAddCatch = () => {
    setShowAddCatchForm(true)
  }

  const handleSaveCatch = (newCatch: FishCatch) => {
    if (activeSession) {
      const updatedSession = {
        ...activeSession,
        catches: [...activeSession.catches, newCatch]
      }
      setActiveSession(updatedSession)
    }
    setShowAddCatchForm(false)
  }

  const handleEndSession = () => {
    if (!activeSession) return

    // Convert active session to completed session
    const completedSession: FishingSession = {
      ...activeSession,
      date: activeSession.startDate,
      endTime: new Date().toLocaleTimeString('ro-RO', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      moonPhase: 'Necunoscut',
      solunarRating: 5,
      rating: 3,
      public: false
    }

    setSessions(prev => [completedSession, ...prev])
    setActiveSession(null)
  }

  const handleUpdateSession = (updatedSession: ActiveSession) => {
    setActiveSession(updatedSession)
  }

  const TabButton = ({ tab, label, icon }: { tab: TabType; label: string; icon: string }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && styles.activeTabButton
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={activeTab === tab ? Colors.primary.blue : Colors.light.textSecondary}
      />
      <Text style={[
        styles.tabText,
        activeTab === tab && styles.activeTabText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Show active session if one exists */}
      {activeSession ? (
        <ActiveSessionView
          session={activeSession}
          onAddCatch={handleAddCatch}
          onEndSession={handleEndSession}
          onUpdateSession={handleUpdateSession}
        />
      ) : (
        <>
          <View style={styles.tabContainer}>
            <TabButton tab="journal" label="Jurnal" icon="book" />
            <TabButton tab="stats" label="Statistici" icon="analytics" />
          </View>

          {activeTab === 'journal' ? (
            <JournalList
              sessions={sessions}
              onSessionPress={handleSessionPress}
              onAddPress={handleAddPress}
            />
          ) : (
            <JournalStats sessions={sessions} />
          )}
        </>
      )}

      {/* Start Session Modal */}
      <Modal
        visible={showStartForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer} edges={['top']}>
          <StartSessionForm
            onStartSession={handleStartSession}
            onCancel={() => setShowStartForm(false)}
          />
        </SafeAreaView>
      </Modal>

      {/* Add Catch Modal */}
      <Modal
        visible={showAddCatchForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer} edges={['top']}>
          <AddCatchForm
            onSave={handleSaveCatch}
            onCancel={() => setShowAddCatchForm(false)}
          />
        </SafeAreaView>
      </Modal>

      {/* Session Detail Modal */}
      <SessionDetailModal
        visible={showSessionDetail}
        session={selectedSession}
        onClose={handleCloseSessionDetail}
        onShare={() => {
          // TODO: Implement session sharing
          console.log('Share session:', selectedSession?.location.name)
        }}
        onEdit={() => {
          // TODO: Implement session editing
          console.log('Edit session:', selectedSession?.location.name)
          handleCloseSessionDetail()
        }}
        onDelete={handleDeleteSession}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary.blue,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  activeTabText: {
    color: Colors.primary.blue,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
})