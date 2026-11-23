import { form, query, command, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import { pdb } from '#lib/prisma/db.ts';

import { resize, upload } from '#lib/util/images.ts';
import { AUTH_PATH, REFRESH_COOKIE } from '#lib/constants.ts';
import { stringSchema } from '#lib/schema.ts';
import { readToken } from '#lib/server/jwt.ts';

export const uploadAvatar = form(
	v.object({
		file: v.file(),
		id: stringSchema
	}),
	async ({ file, id }) => {
		const user = pdb.User.first({ id });
		if (!user) redirect(303, AUTH_PATH);

		const reduced = await resize(file);
		const avatarurl = await upload(reduced);

		await pdb.User.where({ id }).update({ avatarurl });
	}
);

export const getAllSessions = query(stringSchema, async (userid) => {
	let { cookies } = getRequestEvent();
	const current = await readToken<string>(cookies.get(REFRESH_COOKIE));
	const all = await pdb.RefreshToken.where({ userid }).all();
	return { all, current };
});

export const deleteAllSessions = command(stringSchema, async (userid) => {
	await pdb.RefreshToken.where({ userid }).deleteAll();
});

export const deleteSession = command(stringSchema, async (id) => {
	await pdb.RefreshToken.where({ id }).delete();
});
