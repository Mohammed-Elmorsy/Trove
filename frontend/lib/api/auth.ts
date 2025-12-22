import { API_BASE_URL, fetchWithTimeout } from './client';
import type {
  AuthResponse,
  TokenResponse,
  RegisterRequest,
  LoginRequest,
  User,
} from '@/types/auth';

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Registration failed' }));
    throw new Error(error.message || 'Registration failed');
  }

  return res.json();
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Invalid email or password');
  }

  return res.json();
}

export async function refreshTokens(refreshToken: string): Promise<TokenResponse> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Token refresh failed');
  }

  return res.json();
}

export async function getProfile(accessToken: string): Promise<User> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to get profile');
  }

  return res.json();
}

export async function updateProfile(accessToken: string, data: { name?: string }): Promise<User> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/auth/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to update profile');
  }

  return res.json();
}

export async function logout(accessToken: string, refreshToken: string): Promise<void> {
  await fetchWithTimeout(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  }).catch(() => {
    // Ignore logout errors - we'll clear local state anyway
  });
}

export async function getUserOrders(accessToken: string) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/orders/my-orders`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to get orders');
  }

  return res.json();
}
