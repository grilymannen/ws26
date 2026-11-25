import { pdb } from '#lib/prisma/db.ts';
import { command, form, query } from '$app/server';
import { SortMethodSchema, StringSchema } from '#lib/types.ts';
import type { SortMethod } from '#lib/types.ts';
import { on } from 'node:events';
import * as v from 'valibot';
import { appEmitter } from '#lib/server/emitter.ts';
import { EVENT } from '#lib/constants.ts';


let sortMethod: SortMethod = "top"

const allforums = async () => {
  return await pdb.Forum
    .include("messages", (m) => {
      return m.combine({
          count: m.count(),
          participants: m.include("user")
        })
    })
    .orderBy((u) => {
      switch (sortMethod) {
        case "recent":
          return u.created_at.desc();
        case "top":
          return u.messages.count().desc();
        case "old":
          return u.created_at.asc();
        default:
          return u.created_at.desc();
      }
    })
    .all()
}

export const getAllForums = query.live(async function* () {
	yield await allforums();

	for await (const _ of on(appEmitter, EVENT)) {
		yield await allforums();
	}
});

export const createForum = form(
	v.object({ text: StringSchema, userid: StringSchema }),
	async ({ text, userid }) => {
		await pdb.Forum.create({ text, userid });
		appEmitter.emit(EVENT);
	}
);
export const changeMethod = command(SortMethodSchema, (method) => {
  sortMethod = method
  appEmitter.emit(EVENT)
})