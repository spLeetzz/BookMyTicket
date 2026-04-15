// API Configuration
// Update this URL to your hosted backend URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://bookmyticket-1qfu.onrender.com";

// Auth endpoints
export const AUTH_ENDPOINTS = {
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  logout: `${API_BASE_URL}/auth/logout`,
  refresh: `${API_BASE_URL}/auth/refresh`,
  google: `${API_BASE_URL}/google`,
};

// Seats endpoints
export const SEATS_ENDPOINTS = {
  getAll: `${API_BASE_URL}/seats`,
  book: (seatId: number, userId: number) => `${API_BASE_URL}/seats/${seatId}/${userId}`,
};

// Types matching your backend
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Seat {
  id: number;
  seatNo: string;
  isBooked: boolean;
  eventId: number;
  bookedBy: number | null;
}

export interface Event {
  id: number;
  name: string;
  description: string | null;
  date: string;
  venue: string | null;
}

export interface AuthResponse {
  message: string;
  accessToken?: string;
  user?: User;
}

// API helper functions
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  return response;
}

// Auth API functions
export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetchWithAuth(AUTH_ENDPOINTS.register, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetchWithAuth(AUTH_ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  const result = await response.json();
  
  if (result.accessToken) {
    localStorage.setItem("accessToken", result.accessToken);
  }

  return result;
}

export async function logoutUser(): Promise<void> {
  await fetchWithAuth(AUTH_ENDPOINTS.logout, {
    method: "POST",
  });
  localStorage.removeItem("accessToken");
}

export async function refreshToken(): Promise<AuthResponse> {
  const response = await fetchWithAuth(AUTH_ENDPOINTS.refresh, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  const result = await response.json();
  
  if (result.accessToken) {
    localStorage.setItem("accessToken", result.accessToken);
  }

  return result;
}

// Seats API functions
export async function getSeats(): Promise<Seat[]> {
  const response = await fetchWithAuth(SEATS_ENDPOINTS.getAll);

  if (!response.ok) {
    throw new Error("Failed to fetch seats");
  }

  return response.json();
}

export async function bookSeat(seatId: number, userId: number): Promise<Seat> {
  const response = await fetchWithAuth(SEATS_ENDPOINTS.book(seatId, userId), {
    method: "PUT",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to book seat");
  }

  return response.json();
}
