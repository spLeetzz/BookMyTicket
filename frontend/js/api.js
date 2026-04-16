export const API_URL = "https:bookmyticket-production-5e82.up.railway.app";

export const state = {
  get token() {
    return localStorage.getItem("accessToken");
  },
  set token(val) {
    if (val) localStorage.setItem("accessToken", val);
    else localStorage.removeItem("accessToken");
  },
  get user() {
    const token = this.token;
    if (!token) return null;
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedJson = atob(
        payloadBase64.replace(/-/g, "+").replace(/_/g, "/"),
      );
      return JSON.parse(decodedJson);
    } catch (e) {
      return null;
    }
  },
};

export async function apiFetch(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (state.token) {
    headers["Authorization"] = `Bearer ${state.token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    /* blank response */
  }

  if (!response.ok) {
    const msg =
      data?.error?.message || data?.message || `HTTP Error ${response.status}`;
    throw new Error(msg);
  }

  return data;
}
