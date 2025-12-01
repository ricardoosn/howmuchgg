export const SESSION_CONFIG = {
  secret: process.env.SESSION_SECRET ?? 'gameworth_session_secret',
  maxAgeMs: 1000 * 60 * 60 * 24 * 7,
  secure: process.env.SESSION_SECURE === 'true',
} as const;
