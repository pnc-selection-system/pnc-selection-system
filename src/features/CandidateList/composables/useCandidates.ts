import { storeToRefs } from 'pinia'
import { useCandidateStore } from '../stores/candidateStore'
import { useDebouncedWatch } from '@/utils/useDebouncedWatch'

export function useCandidates() {
  const store = useCandidateStore()
  const { candidates, loading, page, total, totalPages, search, province, ngo, status, examResult } = storeToRefs(store)

  useDebouncedWatch([search, province, ngo, status, examResult], () => {
    store.page = 1
    store.fetchCandidates()
  }, 300)

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
