import 'dotenv/config';
import { SignJWT, jwtVerify } from 'jose';
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET missing in .env');

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createToken<T>(key: T, expiration: string) {
	return await new SignJWT({ key })
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime(expiration)
		.sign(secret);
}

export async function readToken<T>(token: string | undefined): Promise<T | null> {
	if (!token) return null;
	try {
		const { payload } = await jwtVerify(token, secret);
		return payload.key as T;
	} catch {
		return null;
	}
}
