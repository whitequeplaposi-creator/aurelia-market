import { createClient } from '@libsql/client/web';

// Safe environment variable access
const getEnvVar = (key: string, fallback: string = ''): string => {
  if (typeof process === 'undefined') return fallback;
  return process.env[key] || fallback;
};

// Check if we're in demo mode
const isDemoMode = getEnvVar('DEMO_MODE') === 'true';

// Turso database configuration
const tursoUrl = getEnvVar('TURSO_DATABASE_URL');
const tursoAuthToken = getEnvVar('TURSO_AUTH_TOKEN');

// Create Turso client (only if not in demo mode)
export const turso = !isDemoMode && tursoUrl && tursoAuthToken
  ? createClient({
      url: tursoUrl,
      authToken: tursoAuthToken,
    })
  : null;

// Helper function to check if database is available
export function isDatabaseAvailable(): boolean {
  return !isDemoMode && turso !== null;
}

// Export for convenience
export { isDemoMode };
