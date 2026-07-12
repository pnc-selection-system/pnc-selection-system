export const TOKEN_COOKIE = 'auth_token'
export const USER_COOKIE = 'auth_user'

const COOKIE_PATH = '/'

export function setCookie(name: string, value: string, days = 7): void {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=${COOKIE_PATH}; SameSite=Lax`
}

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=')
    if (decodeURIComponent(key) === name) {
      return value ? decodeURIComponent(value) : null
    }
  }
  return null
}

export function removeCookie(name: string): void {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${COOKIE_PATH}`
}
