import api from '@/plugins/axios'
import type { AxiosError } from 'axios'
import type { AuthApiResponse, AuthResponse, LoginPayload } from '../types/auth'

export async function login(data: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthApiResponse>('auth/login', data)

    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Invalid email or password')
    }

    return {
      user: response.data.data.user,
      token: response.data.data.access_token,
      tokenType: response.data.data.token_type,
      expiresIn: response.data.data.expires_in,
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    let message = 'Invalid email or password'

    if (axiosError.response?.data?.message) {
      message = axiosError.response.data.message
    } else if (axiosError.response?.status === 401) {
      message = 'Invalid email or password'
    } else if (axiosError.message) {
      message = axiosError.message
    }

    throw new Error(message)
  }
}

export async function logout(): Promise<void> {
  await api.post('auth/logout')
}

export async function me() {
  const response = await api.get('auth/profile')
  return response.data
}