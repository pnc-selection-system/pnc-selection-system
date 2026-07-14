import { watch, type WatchSource, type WatchCallback } from 'vue'

/**
 * Creates a debounced watcher that delays invoking the callback
 * until `delay` milliseconds have elapsed since the last change.
 * Useful for search inputs and filter changes to avoid excessive API calls.
 *
 * @param source - The watch source(s) to observe
 * @param callback - The function to call after the debounce delay
 * @param delay - Debounce delay in milliseconds (default: 300)
 * @param deep - Whether to watch nested object changes (default: false)
 * @param immediate - Whether to invoke callback immediately on creation (default: false)
 */
export function useDebouncedWatch<T>(
  source: WatchSource<T> | WatchSource<T>[],
  callback: WatchCallback<T>,
  delay = 300,
  deep = false,
  immediate = false,
) {
  let timer: ReturnType<typeof setTimeout> | null = null

  watch(
    source,
    (...args) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        callback(...args)
        timer = null
      }, delay)
    },
    { deep, immediate },
  )
}
