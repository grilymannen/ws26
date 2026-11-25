export const REFRESH_COOKIE = 'refresh';
export const ACCESS_COOKIE = 'access';
export const AUTH_PATH = '/auth';
export const ACCESS_TTL_S = 30 * 60;
export const REFRESH_TTL_S = 3 * 24 * 60 * 60;
export const COOKIE_OPTIONS = { httpOnly: true, path: '/', secure: true, sameSite: 'lax' as const };
export const EVENT = '4';
