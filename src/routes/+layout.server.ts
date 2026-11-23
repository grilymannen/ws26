import { redirect } from '@sveltejs/kit';
import { readToken, createToken } from '#lib/server/jwt.ts';
import type { LayoutServerLoad } from './$types';
import {
	ACCESS_COOKIE,
	REFRESH_COOKIE,
	AUTH_PATH,
	ACCESS_TTL_S,
	COOKIE_OPTIONS
} from '#lib/constants.ts';
import { pdb } from '#lib/prisma/db.ts';
import type { AccessCookieData, UserData } from '#lib/types.ts';

export const load: LayoutServerLoad = async ({
	cookies,
	url
}): Promise<{ user: null | UserData }> => {
	const isProtected = url.pathname !== AUTH_PATH;

	const refreshToken = cookies.get(REFRESH_COOKIE);
	const refreshid = await readToken<string>(refreshToken);

	if (!refreshid && !isProtected) {
		return { user: null };
	}
	if (!refreshid) {
		redirect(303, AUTH_PATH);
	}

	const accessToken = cookies.get(ACCESS_COOKIE); // Skip guard since 'readToken' handles it
	const accesscookiedata = await readToken<AccessCookieData>(accessToken);

	if (accesscookiedata) {
		return {
			user: { ...accesscookiedata, created_at: Temporal.Instant.from(accesscookiedata.created_at) }
		};
	}

	const dbToken = await pdb.RefreshToken.include('user').first({ id: refreshid });
	const expired = dbToken && Temporal.Instant.compare(dbToken.expires, Temporal.Now.instant()) < 1;

	if (!dbToken || expired) {
		if (dbToken) await pdb.RefreshToken.where({ id: dbToken.id }).delete();
		cookies.delete(REFRESH_COOKIE, { path: '/' });
		cookies.delete(ACCESS_COOKIE, { path: '/' });
		if (!isProtected) return { user: null };
		redirect(303, AUTH_PATH);
	}

	const user = {
		// without hash
		id: dbToken.userid,
		name: dbToken.user.name,
		created_at: dbToken.user.created_at,
		avatarurl: dbToken.user.avatarurl
	};

	cookies.set(
		ACCESS_COOKIE,
		await createToken<AccessCookieData>(
			{ ...user, created_at: user.created_at.toString() },
			`${ACCESS_TTL_S}s`
		),
		{ maxAge: ACCESS_TTL_S, ...COOKIE_OPTIONS }
	);

	return { user };
};
