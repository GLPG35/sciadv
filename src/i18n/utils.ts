import { ui, defaultLang, showDefaultLang } from "./ui"

export const getLangFromUrl = (url: URL) => {
	const [, lang] = url.pathname.split('/')

	if (lang in ui) return lang as keyof typeof ui

	return defaultLang
}

export const useTranslations = (lang: keyof typeof ui) => {
	return function t(key: keyof typeof ui[typeof defaultLang]) {
		return ui[lang][key] || ui[defaultLang][key]
	}
}

export const useTranslatedPath = (lang: keyof typeof ui) => {
	return function translatePath(path: string, l: string = lang) {
		return !showDefaultLang && l === defaultLang ? path : `/${l}${path}`
	}
}

export const trimLocation = (location: string, lang: keyof typeof ui) => {
	const segments = location.split('/')

	if (segments[1] === lang) {
		segments.splice(1, 1)
	}

	const cleanPath = segments.join('/')

	return cleanPath || '/'
}
