import { form, getRequestEvent } from '$app/server';
import { pdb } from '#lib/prisma/db.ts';
import { authSchema } from '#lib/schema.ts';
import { hashPassword, verifyPassword } from '#lib/server/password.ts';
import {
	ACCESS_COOKIE,
	ACCESS_TTL_S,
	COOKIE_OPTIONS,
	REFRESH_COOKIE,
	REFRESH_TTL_S
} from '#lib/constants.ts';
import { createToken } from '#lib/server/jwt.ts';
import { redirect } from '@sveltejs/kit';
import type { AccessCookieData } from '#lib/types.ts';

const seconds = REFRESH_TTL_S;

export const signup = form(authSchema, async ({ name, pass }) => {
	const existingUser = await pdb.User.first({ name });

	if (existingUser) {
		// User exists
		return { success: false, message: 'User already exists' };
	}

	const hash = hashPassword(pass);

	const user = await pdb.User.create({ name, hash });

	if (!user) {
		// db issue (?)
		return { success: false, message: 'A problem occurred during user sign up' };
	}
	redirect(303, '/app');
});

export const login = form(authSchema, async ({ name, pass }) => {
	const fail = { success: false, message: `User '${name}' does not exist with those credentials` };
	const user = await pdb.User.first({ name });

	if (!user) {
		// User does not exist
		return fail;
	}
	const matches = verifyPassword(pass, user.hash);

	if (!matches) {
		// Wrong password
		return fail;
	}

	const { cookies } = getRequestEvent();

	const expires = Temporal.Now.instant().add({ seconds });
	const refreshToken = await pdb.RefreshToken.create({ expires, userid: user.id });

	const accesscookiedata = {
		id: user.id,
		name: user.name,
		created_at: user.created_at,
		avatarurl: user.avatarurl
	};

	cookies.set(REFRESH_COOKIE, await createToken<string>(refreshToken.id, `${REFRESH_TTL_S}s`), {
		maxAge: REFRESH_TTL_S,
		...COOKIE_OPTIONS
	});
	cookies.set(
		ACCESS_COOKIE,
		await createToken<AccessCookieData>(
			{ ...accesscookiedata, created_at: user.created_at.toString() },
			`${ACCESS_TTL_S}s`
		),
		{ maxAge: ACCESS_TTL_S, ...COOKIE_OPTIONS }
	);

	redirect(303, '/app');
});
