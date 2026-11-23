import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const layoutdata = await parent();
	return layoutdata;
};
