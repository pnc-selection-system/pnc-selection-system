export interface LoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

export interface AuthResponse {
  user: AuthUser
  token: string
}


