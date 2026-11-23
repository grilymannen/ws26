import { goto } from '$app/navigation';
import { deleteCookies } from '../routes/remote';
import { AUTH_PATH } from './constants';

export async function logout() {
	await deleteCookies();
	goto(AUTH_PATH);
}
