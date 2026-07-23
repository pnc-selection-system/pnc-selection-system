import type { AxiosError } from 'axios'

export function isAxiosError(err: unknown): err is AxiosError {
  return (err as AxiosError)?.isAxiosError === true
}

export function getErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    if (err.code === 'ECONNABORTED' && err.message.includes('timeout')) {
      return 'The server is not responding. Please check that the backend service is running and try again.'
    }
    if (!err.response) {
      return 'Unable to connect to the server. Please check your network connection and ensure the backend is running.'
    }
    const data = err.response?.data as Record<string, unknown> | undefined
    if (data?.message && typeof data.message === 'string') {
      return data.message
    }
  }
  return err instanceof Error ? err.message : fallback
}
