import { useState } from "react"
import { motion, AnimatePresence } from 'motion/react'
import { trimLocation, useTranslatedPath } from "../../i18n/utils"
import { languages } from "../../i18n/ui"
import { LuGlobe } from "react-icons/lu"

const list = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.05,
			duration: 0.5
		}
	},
	exit: {
		opacity: 0,
		transition: {
			staggerChildren: 0.1,
			staggerDirection: -1
		}
	}
}

const item = {
	hidden: { x: -100 },
	visible: { x: 0 },
	exit: { x: 100 }
}

const LanguagePicker = ({ currentLang, location }: { currentLang: keyof typeof languages, location: string }) => {
	const [viewLanguage, setViewLanguage] = useState(false)
	const translatePath = useTranslatedPath(currentLang)
	const trimmed = trimLocation(location, currentLang)
		
	return <div className="languagePicker">
		<div className="language" onClick={() => setViewLanguage(!viewLanguage)}>
			<div className="icon">
				<LuGlobe />
			</div>
		</div>
		<AnimatePresence>
			{viewLanguage &&
				<motion.ul variants={list} initial='hidden' animate='visible' exit='exit' className="list">
					{Object.entries(languages).map(([lang, label], i) => (
						<motion.li key={lang} variants={item} className={lang === currentLang ? "active" : ''}>
							<a href={`${translatePath(trimmed, lang)}`}>{label}</a>
						</motion.li>
					))}
				</motion.ul>
			}
		</AnimatePresence>
	</div>
}

export default LanguagePicker
