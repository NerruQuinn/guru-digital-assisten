/**
 * NUCLEAR SANITIZER — Deep recursive sanitization for AI-generated data.
 * Ensures NO JavaScript object can ever be passed to React as a child.
 * 
 * This is the definitive fix for React Error #31:
 * "Objects are not valid as a React child"
 */

/**
 * Force any value into a string. Handles null, undefined, arrays, objects.
 */
export function forceString(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) {
    return val.map(item => forceString(item)).join(', ');
  }
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val);
    } catch {
      return '[Object]';
    }
  }
  return String(val);
}

/**
 * Deep sanitize an entire data object.
 * - Top-level: all values become strings
 * - Arrays: kept as arrays, but items are recursively sanitized
 * - Nested objects in arrays: all their values become strings too
 * - Plain objects at top level: stringified
 * 
 * This produces a structure safe for BOTH React rendering AND docxtemplater.
 * docxtemplater needs: { key: "string", list: [{field: "string"}] }
 * React needs: no raw objects as children
 */
export function deepSanitize(data: any): Record<string, any> {
  if (!data || typeof data !== 'object') return {};

  const safe: Record<string, any> = {};

  for (const key of Object.keys(data)) {
    const val = data[key];

    if (val === null || val === undefined) {
      safe[key] = '';
    } else if (Array.isArray(val)) {
      // Keep arrays (needed for docxtemplater loops like {#outline_mingguan})
      // But sanitize every item inside
      safe[key] = val.map((item: any) => {
        if (item === null || item === undefined) return '';
        if (typeof item === 'string') return item;
        if (typeof item === 'number' || typeof item === 'boolean') return String(item);
        if (typeof item === 'object' && !Array.isArray(item)) {
          // Object inside array → sanitize each field to string
          const safeItem: Record<string, string> = {};
          for (const k of Object.keys(item)) {
            safeItem[k] = forceString(item[k]);
          }
          return safeItem;
        }
        if (Array.isArray(item)) {
          // Nested array → flatten to string
          return forceString(item);
        }
        return String(item);
      });
    } else if (typeof val === 'object') {
      // Plain object at top level → stringify it
      safe[key] = JSON.stringify(val);
    } else {
      safe[key] = String(val);
    }
  }

  return safe;
}

/**
 * Verify that a data object is safe for React rendering.
 * Returns list of problematic keys (should be empty after sanitization).
 */
export function findUnsafeKeys(data: any): string[] {
  if (!data || typeof data !== 'object') return [];
  const unsafe: string[] = [];
  
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      unsafe.push(key);
    }
    if (Array.isArray(val)) {
      val.forEach((item: any, idx: number) => {
        if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
          // Check if object items have non-string values
          for (const k of Object.keys(item)) {
            if (typeof item[k] !== 'string') {
              unsafe.push(`${key}[${idx}].${k}`);
            }
          }
        }
      });
    }
  }
  
  return unsafe;
}
