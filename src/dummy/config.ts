/**
 * Configuration for Dummy API Mocking.
 * When enabled, repositories use in-memory dummy API handlers instead of hitting remote backends.
 * Set EXPO_PUBLIC_USE_DUMMY_API=false in .env when your real backend is ready.
 */
export const USE_DUMMY_API = process.env.EXPO_PUBLIC_USE_DUMMY_API !== 'false';
