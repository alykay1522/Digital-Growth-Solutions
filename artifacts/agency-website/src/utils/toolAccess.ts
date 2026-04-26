const UNLOCK_DURATION_MS = 24 * 60 * 60 * 1000;

function storageKey(toolKey: string) {
  return `tool_access_${toolKey}`;
}

export function storeToolToken(toolKey: string, token: string): void {
  localStorage.setItem(
    storageKey(toolKey),
    JSON.stringify({ token, expiresAt: Date.now() + UNLOCK_DURATION_MS })
  );
}

export function getToolToken(toolKey: string): string | null {
  try {
    const raw = localStorage.getItem(storageKey(toolKey));
    if (!raw) return null;
    const { token, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {
      localStorage.removeItem(storageKey(toolKey));
      return null;
    }
    return token ?? null;
  } catch {
    return null;
  }
}

export function isToolUnlocked(toolKey: string): boolean {
  return getToolToken(toolKey) !== null;
}

export function clearToolToken(toolKey: string): void {
  localStorage.removeItem(storageKey(toolKey));
}
