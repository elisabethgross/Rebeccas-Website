export const ADMIN_PASSWORD_KEY = "rk_admin_password";
export const ADMIN_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

interface StoredSession {
  password: string;
  expiresAt: number;
}

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

function readSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_PASSWORD_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (
      !parsed ||
      typeof parsed.password !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    // Legacy plain-string format from earlier builds — treat as invalid so the
    // user signs in once and gets the new expiring-session format.
    return null;
  }
}

export function getStoredAdminPassword(): string {
  const session = readSession();
  if (!session) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ADMIN_PASSWORD_KEY);
    }
    return "";
  }
  if (session.expiresAt <= Date.now()) {
    clearAdminPassword();
    return "";
  }
  return session.password;
}

export function getAdminSessionExpiry(): number | null {
  const session = readSession();
  if (!session || session.expiresAt <= Date.now()) return null;
  return session.expiresAt;
}

export function storeAdminPassword(pw: string): void {
  const session: StoredSession = {
    password: pw,
    expiresAt: Date.now() + ADMIN_SESSION_TTL_MS,
  };
  localStorage.setItem(ADMIN_PASSWORD_KEY, JSON.stringify(session));
}

export function clearAdminPassword(): void {
  localStorage.removeItem(ADMIN_PASSWORD_KEY);
}
