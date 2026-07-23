import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCandidateStore } from '../stores/candidateStore'
import { useDebouncedWatch } from '@/utils/useDebouncedWatch'

export function useCandidates() {
  const store = useCandidateStore()
  const { candidates, loading, page, total, totalPages, search, province_id, ngo_id, status, examResult, perPage } = storeToRefs(store)

  const filterKey = computed(
    () => `${search.value}|${province_id.value}|${ngo_id.value}|${status.value}|${examResult.value}`
  )

  useDebouncedWatch(
    filterKey,
    () => {
      store.applyFilters()
    },
    300,
    false,
    true,
  )

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
    perPage,
    fetch: store.fetchCandidates,
    setPage: store.setPage,
    setPerPage: store.setPerPage,
  }
}
