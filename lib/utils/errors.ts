/**
 * Standardized error handling utilities
 */

/**
 * Safely extract error message from unknown error
 * @param error - The caught error (unknown type)
 * @param fallback - Fallback message if error message cannot be extracted
 * @returns Error message string
 */
export function getErrorMessage(error: unknown, fallback: string = 'An unexpected error occurred'): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return fallback;
}

/**
 * Check if error is a Prisma error with specific code
 * @param error - The caught error
 * @param code - Prisma error code (e.g., "P2002" for unique constraint)
 * @returns True if error matches the Prisma error code
 */
export function isPrismaError(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === code
  );
}

/**
 * Check if error is a Next.js redirect (not a real error)
 * @param error - The caught error
 * @returns True if error is a Next.js redirect
 */
export function isNextRedirect(error: unknown): boolean {
  if (typeof error === 'object' && error !== null) {
    // Check digest property (Next.js 13+)
    if ('digest' in error && typeof error.digest === 'string') {
      return error.digest.startsWith('NEXT_REDIRECT');
    }
    // Check message property (fallback)
    if ('message' in error && typeof error.message === 'string') {
      return error.message.includes('NEXT_REDIRECT');
    }
  }
  return false;
}

/**
 * Type guard for Error objects
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}
