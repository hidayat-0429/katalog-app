/**
 * Standardized FormData extraction utilities
 */

/**
 * Safely extract a string value from FormData
 * @param formData - The FormData object
 * @param key - The key to extract
 * @returns Trimmed string value or empty string if not found
 */
export function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Safely extract an optional string value from FormData
 * @param formData - The FormData object
 * @param key - The key to extract
 * @returns Trimmed string value, null if empty, or undefined if not found
 */
export function getFormDataOptional(formData: FormData, key: string): string | null | undefined {
  const value = formData.get(key);
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Safely extract a number value from FormData
 * @param formData - The FormData object
 * @param key - The key to extract
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed number or default value
 */
export function getFormDataNumber(formData: FormData, key: string, defaultValue: number = 0): number {
  const value = formData.get(key);
  if (typeof value !== 'string') return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Safely extract a boolean value from FormData (for checkboxes)
 * @param formData - The FormData object
 * @param key - The key to extract
 * @returns True if value is "on" or "true", false otherwise
 */
export function getFormDataBoolean(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  if (typeof value === 'string') {
    return value === 'on' || value === 'true';
  }
  return false;
}
