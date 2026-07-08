import { ref, watch } from 'vue'
import { useCandidateStore } from '../stores/candidateStore'
import { storeToRefs } from 'pinia'

export function useCandidates() {
  const store = useCandidateStore()
  const { candidates, loading, page, total, totalPages } = storeToRefs(store)

  const search = ref('')
  const province = ref('')
  const ngo = ref('')
  const status = ref('')
  const examResult = ref('')

  const fetch = () => {
    store.fetchCandidates({
      search: search.value || undefined,
      province: province.value || undefined,
      ngo: ngo.value || undefined,
      status: status.value || undefined,
      exam_result: examResult.value || undefined,
    })
  }

  watch([search, province, ngo, status, examResult], () => {
    store.page = 1
    fetch()
  })

  return { candidates, loading, page, total, totalPages, search, province, ngo, status, examResult, fetch, setPage: store.setPage }
}
