import * as v from 'valibot'

export type AccessCookieData = {
	id: string;
	name: string;
	created_at: string;
	avatarurl: string | null;
};

export type UserData = {
	id: string;
	name: string;
	created_at: Temporal.Instant;
	avatarurl: string | null;
};

export const SortMethodSchema = v.picklist(['top', 'recent', 'old'])

export type SortMethod = v.InferOutput<typeof SortMethodSchema>;


export const StringSchema = v.pipe(v.string(), v.trim(), v.minLength(3, "Must be at least 3 characters"));
export const AuthSchema = v.object({ name: StringSchema, pass: StringSchema });