import { ACCESS_COOKIE, REFRESH_COOKIE } from '#lib/constants.ts';
import { command, getRequestEvent } from '$app/server';

export const deleteCookies = command(async () => {
	const { cookies } = getRequestEvent();
	cookies.delete(REFRESH_COOKIE);
	cookies.delete(ACCESS_COOKIE);
});
