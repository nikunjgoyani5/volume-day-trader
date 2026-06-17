import type { User } from "@/types/auth.types";

const KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  user: "authUser",
  rememberEmail: "rememberEmail",
  rememberMe: "rememberMe",
} as const;

export type PersistedAuth = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type RememberedLoginPrefs = {
  email: string;
  rememberMe: boolean;
};

function parseUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function getRememberedLoginPrefs(): RememberedLoginPrefs {
  const email = localStorage.getItem(KEYS.rememberEmail) ?? "";
  const rememberMe = localStorage.getItem(KEYS.rememberMe) === "true";

  return { email, rememberMe };
}

export function setRememberedLoginPrefs(
  email: string,
  rememberMe: boolean,
): void {
  if (rememberMe) {
    localStorage.setItem(KEYS.rememberEmail, email.trim().toLowerCase());
    localStorage.setItem(KEYS.rememberMe, "true");
  } else {
    localStorage.removeItem(KEYS.rememberEmail);
    localStorage.removeItem(KEYS.rememberMe);
  }
}

export function persistAuth(
  session: PersistedAuth,
  rememberMe: boolean,
): void {
  const storage = rememberMe ? localStorage : sessionStorage;

  clearSession();

  storage.setItem(KEYS.accessToken, session.accessToken);
  if (session.refreshToken) {
    storage.setItem(KEYS.refreshToken, session.refreshToken);
  }
  storage.setItem(KEYS.user, JSON.stringify(session.user));
}

export function getPersistedAuth(): PersistedAuth | null {
  for (const storage of [localStorage, sessionStorage]) {
    const accessToken = storage.getItem(KEYS.accessToken);
    const user = parseUser(storage.getItem(KEYS.user));

    if (accessToken && user) {
      return {
        accessToken,
        refreshToken: storage.getItem(KEYS.refreshToken) ?? "",
        user,
      };
    }
  }

  return null;
}

/** Clears session tokens only (keeps remembered email if user opted in). */
export function clearSession(): void {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(KEYS.accessToken);
    storage.removeItem(KEYS.refreshToken);
    storage.removeItem(KEYS.user);
  }
}

/** Clears session and remembered login preferences. */
export function clearAuth(): void {
  clearSession();
  localStorage.removeItem(KEYS.rememberEmail);
  localStorage.removeItem(KEYS.rememberMe);
}
