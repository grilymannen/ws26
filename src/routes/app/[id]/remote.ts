import { pdb } from '#lib/prisma/db.ts';
import { stringSchema } from '#lib/schema.ts';
import { form, query } from '$app/server';
import { on, EventEmitter } from 'node:events';
import * as v from 'valibot';

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

export const getForum = query(stringSchema, async (id) => {
	return await pdb.Forum.include('user').first({ id });
});

export const getMessages = query.live(stringSchema, async function* (forumid) {
	yield await pdb.Message.where({ forumid })
		.include('user', (user) => user.select('id', 'name', 'created_at', 'avatarurl'))
		.all();

	for await (const _ of on(emitter, forumid)) {
		yield await pdb.Message.where({ forumid })
			.include('user', (user) => user.select('id', 'name', 'created_at', 'avatarurl'))
			.all();
	}
});

export const createMessage = form(
	v.object({ text: stringSchema, userid: stringSchema, forumid: stringSchema }),
	async ({ text, userid, forumid }) => {
		await pdb.Message.create({ text, userid, forumid });
		emitter.emit(forumid);
	}
);
