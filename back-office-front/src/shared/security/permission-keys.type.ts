/**
 * FICHERO GENERADO MANUALMENTE - NO MODIFICAR MANUALMENTE
 * Fuente: Base de datos (via http://localhost:8080/api/internal/permissions/keys)
 */

export type PermissionKey = typeof PERMISSIONS_KEYS[number];

export function isPermissionKey(key: string): key is PermissionKey{
  return (PERMISSIONS_KEYS as readonly string[]).includes(key);
}

const PERMISSIONS_KEYS = [
  "ANONYMOUS",
  "ROUTE_READ",
  "ROUTE_WRITE",
  "USER_READ",
  "USER_WRITE",
  "USER_DELETE",
  "ROLE_READ",
  "ROLE_WRITE",
  "ROLE_DELETE",
  "TRANSLATION_READ",
  "TRANSLATION_WRITE"
] as const;
