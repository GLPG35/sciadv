import { defineMiddleware } from "astro/middleware"

export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next()

	if (response.status === 404) {
		const { pathname } = context.url

		if (pathname.startsWith('/es/')) {
			return context.rewrite('/es/404')
		}

		return context.rewrite('/404')
	}

	return response
})
