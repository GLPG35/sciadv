import { useState, type KeyboardEvent } from "react"
import { motion, AnimatePresence } from 'motion/react'
import { LuCheck, LuKeyRound, LuX } from "react-icons/lu"
import { usePasswordStore } from "../../store/entryStore"
import { getLangFromUrl, useTranslations } from "../../i18n/utils"

const Password = ({ url }: { url: URL }) => {
	const [viewInput, setViewInput] = useState(false)
	const [pass, setPass] = useState('')
	const [wrong, setWrong] = useState(false)
	const unlock = usePasswordStore(state => state.unlock)
	const unlocked = usePasswordStore(state => state.unlocked)
	const currentLang = getLangFromUrl(url)
	const t = useTranslations(currentLang)

	if (unlocked || unlocked === undefined) return null

	const handleUnlock = () => {
		if (wrong) return
		
		const unlocked = unlock(pass)

		if (!unlocked) {
			setWrong(true)
			setPass('')

			return setTimeout(() => {
				setWrong(false)
			}, 3000)
		}
	}

	const handleKeyDown = (e: KeyboardEvent) => {
		const { key } = e

		if (key === 'Enter') {
			handleUnlock()
		}
	}
		
	return <AnimatePresence mode="wait">
		{!unlocked ?
			<div className="passwordWrapper">
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="password" onClick={() => setViewInput(!viewInput)}>
					<div className="icon">
						<LuKeyRound />
					</div>
				</motion.div>
				<AnimatePresence propagate>
					{viewInput &&
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inputWrapper">
							<motion.div initial={{ x: -100 }} animate={{ x: 0 }} exit={{ x: 100 }} className="input">
								<input placeholder={t('nav.password')} type={wrong ? 'text' : "password"} onKeyDown={handleKeyDown} onChange={e => setPass(e.currentTarget.value)} value={wrong ? t('nav.passwordError') : pass} readOnly={wrong} />
								<button onClick={handleUnlock} disabled={wrong}>
									<div className="icon">
										{wrong ?
											<LuX />
										:
											<LuCheck />
										}
									</div>
								</button>
							</motion.div>
						</motion.div>
					}
				</AnimatePresence>
			</div>
		: <></>}
	</AnimatePresence>
}

export default Password
