import { EVENT } from '#lib/constants.ts';
import { pdb } from '#lib/prisma/db.ts';
import { appEmitter } from '#lib/server/emitter.ts';
import { StringSchema } from '#lib/types.ts';
import { form, query } from '$app/server';
import { on, EventEmitter } from 'node:events';

import * as v from 'valibot';

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

const getterFunction = async (forumid: string) => {
  return await pdb.Message
    .where({ forumid })
    .include('user', (u) => u.select('id', 'name', 'created_at', 'avatarurl'))
    .all()
}

export const getForum = query(StringSchema, async (id) => {
	return await pdb.Forum.include('user', (u) => u.select('id', 'name', 'created_at', 'avatarurl')).first({ id });
});

export const getMessages = query.live(StringSchema, async function* (forumid) {
	yield await getterFunction(forumid)

	for await (const _ of on(emitter, forumid)) {
		yield await getterFunction(forumid)
	}
});

export const createMessage = form(
	v.object({ text: StringSchema, userid: StringSchema, forumid: StringSchema }),
	async ({ text, userid, forumid }) => {
		await pdb.Message.create({ text, userid, forumid });
    emitter.emit(forumid);
		appEmitter.emit(EVENT)
	}
);
