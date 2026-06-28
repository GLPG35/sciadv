import { defineMiddleware } from "astro/middleware"

const excemptions = [
	'/404',
	'/404/',
	'/es/404',
	'/es/404/'
]

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = context.url

	if (excemptions.includes(pathname)) {
		return next()
	}

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
