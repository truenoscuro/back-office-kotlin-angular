/**
 * FICHERO GENERADO MANUALMENTE - NO MODIFICAR MANUALMENTE
 * Fuente: Base de datos (via http://localhost:8080/api/internal/translations/keys)
 */

export type TranslationKey = typeof TRANSLATION_KEYS[number];

export function isTranslationKey(key: string): key is TranslationKey{
  return (TRANSLATION_KEYS as readonly string[]).includes(key);
}

const TRANSLATION_KEYS = [
  "LOGIN.BUTTON_LOGIN",
  "LOGIN.EMAIL",
  "LOGIN.EMAIL_INVALID",
  "LOGIN.EMAIL_REQUIRED",
  "LOGIN.PASSWORD",
  "LOGIN.PASSWORD_REQUIRED",
  "LOGIN.TITLE"
] as const;
