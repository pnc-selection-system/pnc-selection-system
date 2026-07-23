import { watch, type WatchSource, type WatchCallback } from 'vue'

let timer: ReturnType<typeof setTimeout> | null = null

export function useDebouncedWatch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  delay = 300,
  deep = false,
  immediate = false,
) {
  watch(
    source,
    (...args: any[]) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        ;(callback as any)(...args)
        timer = null
      }, delay)
    },
    { deep, immediate },
  )
}
