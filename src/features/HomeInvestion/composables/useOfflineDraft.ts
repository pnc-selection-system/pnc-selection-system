import { ref } from 'vue'
import api from '@/plugins/axios'
import type { HStatus, InvestigationFormData } from '../types/visit'

const DRAFT_PREFIX = 'hi_draft_'
const QUEUE_KEY = 'hi_pending_queue'

interface PendingAction {
  type: 'saveDraft' | 'submit'
  candidateId: string
  data: Record<string, any>
  timestamp: number
}

/** Load pending action queue from localStorage */
function loadPendingActions(): PendingAction[] {
  try {
    const stored = localStorage.getItem(QUEUE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/** Save pending action queue to localStorage */
function savePendingActions(actions: PendingAction[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(actions))
  } catch {
    // Storage full or unavailable
  }
}

/**
 * Composable for offline-first draft saving.
 *
 * - Saves form text data to localStorage so the user can work without a network.
 * - Queues save/submit actions and replays them when the user comes back online.
 * - Restores drafts automatically when the candidate is selected again.
 *
 * NOTE: Pending file uploads are kept in memory only (File objects cannot be
 * serialized to localStorage). On page refresh while offline, queued uploads
 * are lost.
 */
export function useOfflineDraft() {
  const hasLocalDraft = ref(false)
  const pendingActions = ref<PendingAction[]>(loadPendingActions())
  const isOnline = ref(navigator.onLine)
  const syncing = ref(false)

  function onOnline() {
    isOnline.value = true
  }
  function onOffline() {
    isOnline.value = false
  }

  // Listen for online/offline events (cleaned up by caller via cleanup())
  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)

  // ── Local draft storage ──────────────────────────────────────────────

  /** Save form data to localStorage for the given candidate */
  function saveDraftLocally(candidateId: string, data: InvestigationFormData) {
    try {
      localStorage.setItem(DRAFT_PREFIX + candidateId, JSON.stringify(data))
      hasLocalDraft.value = true
    } catch {
      // Storage full – silently ignore
    }
  }

  /** Load a previously saved local draft for the candidate */
  function loadDraftFromStorage(candidateId: string): InvestigationFormData | null {
    try {
      const stored = localStorage.getItem(DRAFT_PREFIX + candidateId)
      if (stored) {
        hasLocalDraft.value = true
        return JSON.parse(stored) as InvestigationFormData
      }
    } catch {
      // Corrupted data
    }
    return null
  }

  /** Remove local draft for the candidate */
  function clearDraft(candidateId: string) {
    localStorage.removeItem(DRAFT_PREFIX + candidateId)
    // Also clear any pending actions for this candidate
    pendingActions.value = pendingActions.value.filter(a => a.candidateId !== candidateId)
    savePendingActions(pendingActions.value)
    hasLocalDraft.value = pendingActions.value.length > 0
  }

  /** Save form data locally AND try the API. Queues the action if offline. */
  async function saveDraft(data: InvestigationFormData): Promise<InvestigationFormData | null> {
    // Always save locally first
    saveDraftLocally(data.candidateId, data)

    // Build the payload the API expects
    const payload = {
      visitDate: data.visitDate,
      location: data.location,
      gpsCoordinates: data.gpsCoordinates,
      peopleMet: data.peopleMet,
      observations: data.observations,
      findings: data.findings,
      recommendation: data.recommendation,
      reason: data.reason,
    }

    if (!navigator.onLine) {
      // Offline — queue the action
      pendingActions.value.push({
        type: 'saveDraft',
        candidateId: data.candidateId,
        data: payload,
        timestamp: Date.now(),
      })
      savePendingActions(pendingActions.value)
      return data // Return local data as optimistic response
    }

    try {
      const { data: response } = await api.put(
        `/home-investigation/candidates/${data.candidateId}/draft`,
        payload,
      )
      // API succeeded — clear local draft
      clearDraft(data.candidateId)
      return response
    } catch {
      // Network error — queue for later sync
      pendingActions.value.push({
        type: 'saveDraft',
        candidateId: data.candidateId,
        data: payload,
        timestamp: Date.now(),
      })
      savePendingActions(pendingActions.value)
      return data // Return local data
    }
  }

  /** Save form data locally AND try the API submit. Queues if offline. */
  async function submit(data: InvestigationFormData): Promise<InvestigationFormData | null> {
    const submittedData: InvestigationFormData = { ...data, currentStatus: 'Submitted' as HStatus }

    // Save locally first
    saveDraftLocally(data.candidateId, submittedData)

    const payload = {
      visitDate: data.visitDate,
      location: data.location,
      gpsCoordinates: data.gpsCoordinates,
      peopleMet: data.peopleMet,
      observations: data.observations,
      findings: data.findings,
      recommendation: data.recommendation,
      reason: data.reason,
    }

    if (!navigator.onLine) {
      pendingActions.value.push({
        type: 'submit',
        candidateId: data.candidateId,
        data: payload,
        timestamp: Date.now(),
      })
      savePendingActions(pendingActions.value)
      return submittedData
    }

    try {
      const { data: response } = await api.put(
        `/home-investigation/candidates/${data.candidateId}/submit`,
        payload,
      )
      clearDraft(data.candidateId)
      return response
    } catch {
      pendingActions.value.push({
        type: 'submit',
        candidateId: data.candidateId,
        data: payload,
        timestamp: Date.now(),
      })
      savePendingActions(pendingActions.value)
      return submittedData
    }
  }

  // ── Sync queue ───────────────────────────────────────────────────────

  /** Try to replay all queued actions against the API */
  async function syncPendingActions() {
    if (syncing.value || pendingActions.value.length === 0) return
    syncing.value = true

    const queue = [...pendingActions.value]
    const remaining: PendingAction[] = []

    for (const action of queue) {
      try {
        if (action.type === 'saveDraft') {
          await api.put(`/home-investigation/candidates/${action.candidateId}/draft`, action.data)
        } else if (action.type === 'submit') {
          await api.put(`/home-investigation/candidates/${action.candidateId}/submit`, action.data)
        }
        // Clear local draft on success
        localStorage.removeItem(DRAFT_PREFIX + action.candidateId)
      } catch (e: any) {
        if (e?.response) {
          // Server responded with an error — skip this action (won't succeed later)
          continue
        }
        // Network error — keep in queue for later retry
        remaining.push(action)
      }
    }

    pendingActions.value = remaining
    savePendingActions(remaining)
    hasLocalDraft.value = remaining.length > 0
    syncing.value = false
  }

  // ── Cleanup ──────────────────────────────────────────────────────────

  /** Call from onUnmounted to clean up event listeners */
  function cleanup() {
    window.removeEventListener('online', onOnline)
    window.removeEventListener('offline', onOffline)
  }

  return {
    hasLocalDraft,
    pendingActions,
    isOnline,
    syncing,
    saveDraftLocally,
    loadDraftFromStorage,
    clearDraft,
    saveDraft,
    submit,
    syncPendingActions,
    cleanup,
  }
}
