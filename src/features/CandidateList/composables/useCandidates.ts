import { storeToRefs } from 'pinia'
import { useCandidateStore } from '../stores/candidateStore'
import { useDebouncedWatch } from '@/utils/useDebouncedWatch'

export function useCandidates() {
  const store = useCandidateStore()
  const { candidates, loading, page, total, totalPages, search, province_id, ngo_id, status, examResult } = storeToRefs(store)

  watch([search, province_id, ngo_id, status, examResult], () => {
    store.page = 1
    store.applyFilters()
  })

  return {
    candidates,
    loading,
    page,
    total,
    totalPages,
    search,
    province_id,
    ngo_id,
    status,
    examResult,
    fetch: store.fetchCandidates,
    setPage: store.setPage,
  }
}
