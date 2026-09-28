/**
 * Environment configuration with runtime validation
 * WARNING: Only use these in SERVER-ONLY contexts (API routes, server actions, server components)
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * Validate all required environment variables at startup
 * Call this in a server-only context (e.g., API route or server component)
 */
export function validateEnv(): void {
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(k => `  - ${k}`).join('\n')}`
    );
  }
}

/**
 * Server-only configuration getter
 * This function should only be called in server contexts
 */
export function getServerConfig() {
  // Only access env vars on server side
  if (typeof window !== 'undefined') {
    throw new Error('getServerConfig() can only be called on the server side');
  }

  return {
    // Database
    databaseUrl: requireEnv('DATABASE_URL'),
    
    // NextAuth
    nextAuth: {
      secret: requireEnv('NEXTAUTH_SECRET'),
      url: requireEnv('NEXTAUTH_URL'),
    },
    
    // Supabase (optional - only for upload feature)
    supabase: {
      url: getEnv('NEXT_PUBLIC_SUPABASE_URL'),
      anonKey: getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
      serviceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY'),
    },
  };
}

/**
 * Client-safe configuration
 * These values are safe to access from both client and server
 */
export const config = {
  // App
  app: {
    baseUrl: getEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000'),
    env: getEnv('NODE_ENV', 'development'),
  },
  
  // Feature flags
  features: {
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    enableLogging: typeof window === 'undefined' 
      ? (process.env.NODE_ENV !== 'production' || getEnv('ENABLE_LOGGING') === 'true')
      : false, // Disable logging on client side
  },
} as const;

/**
 * Check if Supabase is configured (server-side only)
 */
export function isSupabaseConfigured(): boolean {
  if (typeof window !== 'undefined') {
    // On client, check public env vars only
    return !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
