import api from '@/plugins/axios'
import type { AxiosError } from 'axios'
import type { AuthApiResponse, AuthResponse, LoginPayload } from '../types/auth'

const DEFAULT_ERROR_MESSAGE = 'Invalid email or password'

export async function login(data: LoginPayload): Promise<AuthResponse> {
  try {
    const { data: response } = await api.post<AuthApiResponse>('auth/login', data)

    if (!response.success) {
      throw new Error(response.message ?? DEFAULT_ERROR_MESSAGE)
    }

    return {
      user: response.data.user,
      token: response.data.access_token,
      refreshToken: response.data.refresh_token,
      tokenType: response.data.token_type,
      expiresIn: response.data.expires_in,
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>

    throw new Error(
      axiosError.response?.data?.message ??
        (axiosError.response?.status === 401
          ? DEFAULT_ERROR_MESSAGE
          : axiosError.message) ??
        DEFAULT_ERROR_MESSAGE,
    )
  }
}

export async function refreshToken(refreshTokenValue: string): Promise<AuthResponse> {
  // The backend expects the refresh token in the request body
  const { data: response } = await api.post<AuthApiResponse>('auth/refresh', {
    refresh_token: refreshTokenValue,
  })

  if (!response.success) {
    throw new Error(response.message ?? 'Failed to refresh token')
  }

  return {
    user: response.data.user,
    token: response.data.access_token,
    refreshToken: response.data.refresh_token,
    tokenType: response.data.token_type,
    expiresIn: response.data.expires_in,
  }
}

export async function logout(): Promise<void> {
  await api.post('auth/logout')
}

export async function me() {
  const { data } = await api.get('auth/profile')
  return data
}