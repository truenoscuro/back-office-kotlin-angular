/**
 * FICHERO GENERADO MANUALMENTE - NO MODIFICAR MANUALMENTE
 * Fuente: Base de datos (via http://localhost:8080/api/internal/screens/keys)
 */

export type ScreenKey = typeof SCREEN_KEYS[number];

export function isScreenKey(key: string): key is ScreenKey{
  return (SCREEN_KEYS as readonly string[]).includes(key);
}

const SCREEN_KEYS = [
  "anonymous",
  "dashboard",
  "routes",
  "roles",
  "users"
] as const;
