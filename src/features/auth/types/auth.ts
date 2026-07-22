export interface LoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  id: number
  email: string
  name: string
  role: string
  role_id: number
  permissions: string[]
  phone?: string
  active?: boolean
}

export interface AuthApiResponse {
  success: boolean
  message: string
  data: {
    expires_in: number
    user: AuthUser
    token_type: string
    access_token: string
  }
}

export interface AuthResponse {
  user: AuthUser
  token: string
  tokenType: string
  expiresIn: number
}


