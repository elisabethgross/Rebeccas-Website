export const ADMIN_PASSWORD_KEY = "rk_admin_password";

export class AdminUnauthorizedError extends Error {
  constructor() {
    super("UNAUTHORIZED");
    this.name = "AdminUnauthorizedError";
  }
}

export async function adminFetch(
  password: string,
  url: string,
  options: RequestInit = {}
) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "x-admin-password": password,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (res.status === 401) {
    throw new AdminUnauthorizedError();
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function getStoredAdminPassword(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || "";
}

export function storeAdminPassword(pw: string): void {
  localStorage.setItem(ADMIN_PASSWORD_KEY, pw);
}

export function clearAdminPassword(): void {
  localStorage.removeItem(ADMIN_PASSWORD_KEY);
}
