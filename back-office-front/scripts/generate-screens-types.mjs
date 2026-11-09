import fs from 'node:fs';
import path from 'node:path';

const BACKEND_URL = 'http://localhost:8080/internal/api/screens/keys';
const OUTPUT_FILE = path.resolve('src/shared/router/screen-keys.type.ts');

async function generateTranslationTypes() {
  try {
    console.log('🔄 Conectando con el backend descargando las keys...');
    const res = await fetch(BACKEND_URL);

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status} ${res.statusText}`);
    }

    /** @type {string[]} */
    const keys = (await res.json()) || [];

    if (keys.length === 0) {
      console.warn('⚠️ No se han encontrado keys de pantallas.');
    }

    // Construïm la unió de tipus en TypeScript
    const unionKeys = keys.map((key) => `"${key}"`).join(',\n  ');

    const fileContent = `/**
 * FICHERO GENERADO MANUALMENTE - NO MODIFICAR MANUALMENTE
 * Fuente: Base de datos (via ${BACKEND_URL})
 */

export type ScreenKey = typeof SCREEN_KEYS[number];

export function isScreenKey(key: string): key is ScreenKey{
  return (SCREEN_KEYS as readonly string[]).includes(key);
}

const SCREEN_KEYS = [
  ${unionKeys}
] as const;
`;

    // Assegura que la carpeta destí existeix
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf-8');
    console.log(`✅ Tipo generado con exito en: ${OUTPUT_FILE}`);
    console.log(`📊 Total claves registradas: ${keys.length}`);
  } catch (error) {
    console.error('❌ Error en generar los tipos:', error.message);
    process.exit(1);
  }
}

generateTranslationTypes().catch(console.error);
