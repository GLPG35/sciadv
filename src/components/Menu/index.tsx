import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { getLangFromUrl, useTranslatedPath, useTranslations } from '../../i18n/utils'
import { LuX } from 'react-icons/lu'

const parent = {
	hidden: { opacity: 0, x: -200 },
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1,
		}
	},
	exit: {
		opacity: 0,
		x: -200,
		transition: {
			staggerChildren: 0.1,
			staggerDirection: -1
		}
	}
}

const item = {
	hidden: { opacity: 0, x: -100 },
	visible: { opacity: 1, x: 0 },
	exit: { opacity: 0, x: 100 }
}

const Menu = ({ url }: { url: URL }) => {
	const [menu, setMenu] = useState(false)
	const currentLang = getLangFromUrl(url)
	const t = useTranslations(currentLang)
	const translatePath = useTranslatedPath(currentLang)
	
	return (
		<div className="subMenu">
			<div className='menuIcon' onClick={() => setMenu(true)}>
				<img src="/sciadv_logo.svg" alt="Science Adventure Series Logo" />
			</div>
			<AnimatePresence>
				{menu &&
					<motion.div variants={parent} initial='hidden' animate='visible' exit='exit' className="menuList">
						<div className="listWrapper">
							<button className="closeIcon" onClick={() => setMenu(false)}>
								<div className="icon">
									<LuX />
								</div>
							</button>
							<ul>
								<li><motion.a variants={item} href={translatePath('/')}>{t('nav.home')}</motion.a></li>
								<li><motion.a variants={item} href={translatePath('/entries')}>{t('nav.entries')}</motion.a></li>
								<li><motion.a variants={item} href={translatePath('/sidecontent')}>{t('nav.sideContent')}</motion.a></li>
								<li><motion.a variants={item} href={translatePath('/music')}>{t('nav.music')}</motion.a></li>
							</ul>
						</div>
					</motion.div>
				}
			</AnimatePresence>
		</div>
	)
}

export default Menu
