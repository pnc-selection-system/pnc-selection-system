import { ref, computed, readonly, watch, type Ref, type DeepReadonly, type MaybeRefOrGetter, toValue } from 'vue'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CacheEntry<T> {
  data: T
  timestamp: number
}

export interface CacheFetchOptions {
  /** Time-to-live in milliseconds. Default: 60_000 (1 minute). */
  ttl?: number
  /** If true, forces a network request even if a fresh cache entry exists. */
  force?: boolean
}

export interface UseCacheFetchReturn<T> {
  data: DeepReadonly<Ref<T | null>>
  loading: DeepReadonly<Ref<boolean>>
  error: DeepReadonly<Ref<string | null>>
  /** Manually refresh by re-fetching from the network. Pass `true` to bypass cache. */
  refresh: (force?: boolean) => Promise<T | null>
  /** Clear the cached entry for the current key. */
  clear: () => void
  /** Whether the returned data came from cache (vs fresh network fetch). */
  fromCache: DeepReadonly<Ref<boolean>>
}

// ---------------------------------------------------------------------------
// Global cache store (shared across all component instances)
// ---------------------------------------------------------------------------

const cacheStore = new Map<string, CacheEntry<any>>()
const inflightStore = new Map<string, Promise<any>>()

/**
 * Remove all cache entries older than 5 minutes to prevent unbounded memory growth.
 */
export function pruneExpiredCache(): void {
  const cutoff = Date.now() - 300_000
  for (const [key, entry] of cacheStore) {
    if (entry.timestamp && entry.timestamp < cutoff) {
      cacheStore.delete(key)
    }
  }
}

/** Clear every cached entry (useful on logout). */
export function clearAllCache(): void {
  cacheStore.clear()
  inflightStore.clear()
}

/**
 * Manually populate the cache with data before a component mounts.
 * Useful for route-level pre-fetching — call this in `beforeEnter` so
 * the component's `useCacheFetch` finds the data already cached.
 */
export function prefetchCache<T>(key: string, data: T): void {
  cacheStore.set(key, { data, timestamp: Date.now() })
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------

/**
 * A Vue composable that wraps an async fetcher with:
 *
 * - **In-memory cache** with configurable TTL
 * - **Request deduplication** — simultaneous calls for the same key share one
 *   in-flight promise
 * - **Stale-while-revalidate** — returns cached data instantly while
 *   refreshing in the background
 * - **Reactive key support** — pass a ref/computed ref as `key`; the
 *   composable watches it and re-fetches when it changes
 *
 * @example
 * ```ts
 * const campaignId = ref(1)
 * const { data, loading } = useCacheFetch(
 *   () => `subjects:${campaignId.value}`,
 *   () => examSubjectService.fetchSubjects(campaignId.value),
 *   { ttl: 30_000 },
 * )
 * ```
 */
export function useCacheFetch<T>(
  key: MaybeRefOrGetter<string>,
  fetcher: () => Promise<T>,
  options?: CacheFetchOptions,
): UseCacheFetchReturn<T> {
  const { ttl = 60_000, force = false } = options ?? {}

  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<string | null>(null)
  const fromCache = ref(false)

  async function refresh(forceRefresh = false): Promise<T | null> {
    const resolvedKey = toValue(key)
    if (!resolvedKey) {
      data.value = null
      fromCache.value = false
      return null
    }

    const now = Date.now()
    const cached = cacheStore.get(resolvedKey)

    // ---- Fresh cache hit ---------------------------------------------------
    if (!forceRefresh && cached && now - cached.timestamp < ttl) {
      data.value = cached.data
      fromCache.value = true
      error.value = null
      loading.value = false
      return cached.data
    }

    // ---- Stale-while-revalidate --------------------------------------------
    if (cached) {
      data.value = cached.data
      fromCache.value = true
    }

    // ---- Deduplicate in-flight requests ------------------------------------
    const inflight = inflightStore.get(resolvedKey)
    if (inflight && !forceRefresh) {
      try {
        const result = await inflight
        data.value = result
        fromCache.value = false
        error.value = null
        return result
      } catch {
        inflightStore.delete(resolvedKey)
      }
    }

    // ---- Fetch fresh data --------------------------------------------------
    loading.value = true
    fromCache.value = false
    error.value = null

    const promise = fetcher()
      .then((result) => {
        cacheStore.set(resolvedKey, { data: result, timestamp: Date.now() })
        data.value = result
        return result
      })
      .catch((err: any) => {
        const message =
          err?.response?.data?.message || err?.message || 'An unexpected error occurred'
        if (!cached) {
          data.value = null
        }
        error.value = message
        throw err
      })
      .finally(() => {
        loading.value = false
        inflightStore.delete(resolvedKey)
      })

    inflightStore.set(resolvedKey, promise)
    return promise
  }

  function clear() {
    const resolvedKey = toValue(key)
    if (resolvedKey) {
      cacheStore.delete(resolvedKey)
      inflightStore.delete(resolvedKey)
    }
    data.value = null
    error.value = null
    loading.value = false
    fromCache.value = false
  }

  // ---- Watch for key changes (e.g. campaign switch) -----------------------
  watch(
    () => toValue(key),
    (newKey, oldKey) => {
      // If the key is empty, clear everything and stop.
      if (!newKey) {
        data.value = null
        loading.value = false
        error.value = null
        fromCache.value = false
        return
      }

      // Check if the new key already has a fresh cache entry.
      const cached = cacheStore.get(newKey)
      if (cached && Date.now() - cached.timestamp < ttl) {
        data.value = cached.data
        fromCache.value = true
        error.value = null
        return
      }

      // Try stale cache first, then fetch.
      if (cached) {
        data.value = cached.data
        fromCache.value = true
      } else {
        data.value = null
        fromCache.value = false
      }

      // Reset loading/error before fetching.
      loading.value = true
      error.value = null

      // Deduplicate against the *new* key
      const inflight = inflightStore.get(newKey)
      if (inflight) {
        inflight
          .then((result) => {
            data.value = result
            fromCache.value = false
          })
          .catch(() => {})
          .finally(() => {
            loading.value = false
          })
        return
      }

      const promise = fetcher()
        .then((result) => {
          cacheStore.set(newKey, { data: result, timestamp: Date.now() })
          data.value = result
          fromCache.value = false
        })
        .catch((err: any) => {
          const message =
            err?.response?.data?.message || err?.message || 'An unexpected error occurred'
          if (!cached) {
            data.value = null
          }
          error.value = message
        })
        .finally(() => {
          loading.value = false
          inflightStore.delete(newKey)
        })

      inflightStore.set(newKey, promise)
    },
    { immediate: !force },
  )

  return {
    data: readonly(data) as DeepReadonly<Ref<T | null>>,
    loading: readonly(loading) as DeepReadonly<Ref<boolean>>,
    error: readonly(error) as DeepReadonly<Ref<string | null>>,
    refresh: (forceRefresh = false) => refresh(forceRefresh),
    clear,
    fromCache: readonly(fromCache) as DeepReadonly<Ref<boolean>>,
  }
}

