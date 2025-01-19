export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return { user: null };
	}
	return {
		user: {
			id: locals.user.id,
			email: locals.user.email,
			temp: locals.user.temp
		}
	};
};
