import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCandidateStore } from '../stores/candidateStore'

export function useCandidates() {
  const store = useCandidateStore()
  const { candidates, loading, page, total, totalPages, search, province, ngo, status, examResult } = storeToRefs(store)

  watch([search, province, ngo, status, examResult], () => {
    store.page = 1
    store.fetchCandidates()
  })

  return {
    candidates,
    loading,
    page,
    total,
    totalPages,
    search,
    province,
    ngo,
    status,
    examResult,
    fetch: store.fetchCandidates,
    setPage: store.setPage,
  }
}
