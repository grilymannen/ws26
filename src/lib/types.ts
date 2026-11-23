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
