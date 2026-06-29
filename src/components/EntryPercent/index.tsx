import { useEffect, useState } from "react"
import { useEntryStore, type Title } from "../../store/entryStore"
import './styles.scss'
import { animate, useMotionValue, useTransform, motion } from "motion/react"

type SideContentType = typeof import('../../utils/sidecontent.json')
type List = SideContentType[number]['list']

const formatNumber = (num: number) => {
	if (num >= 100) return '100'
	if (num >= 10) return num.toFixed(1)

	return num.toFixed(2)
}

const EntryPercent = ({ title, list }: { title: Title, list: List }) => {
	const totalChecked = useEntryStore(state => {
		const entry = state.sideChecklist.find(x => x.title === title)

		const reduceList = entry ? (entry.list.reduce((prev, curr) => {
			if (!list.some(x => x.uuid === curr)) return prev
			
			return prev + 1 
		}, 0) / list.length) * 100 : 0
		
		return reduceList
	})

	const [displayPercent, setDisplayPercent] = useState(() => formatNumber(totalChecked))
	const textMotion = useMotionValue(totalChecked)
	const barMotion = useMotionValue(totalChecked)
	const animatedWidth = useTransform(barMotion, latest => `${latest}%`)

	useEffect(() => {
		const unsubscribe = textMotion.on('change', latest => setDisplayPercent(formatNumber(latest))) 

		const textControls = animate(textMotion, totalChecked, {
			type: 'tween',
			duration: 0.4,
			ease: 'easeOut'
		})
		
		const barControls = animate(barMotion, totalChecked, {
			type: 'spring',
			stiffness: 180,
			damping: 14,
			mass: 0.9,
			restDelta: 0.01
		})

		return () => {
			textControls.stop()
			barControls.stop()
			unsubscribe()
		}
	}, [totalChecked, textMotion, barMotion])

	return (
		<div className="progress">
			<motion.span>{displayPercent}%</motion.span>
			<div className="barWrapper">
				<div className="barWrapper2">
					<motion.div className="bar" style={{ width: animatedWidth }}></motion.div>
				</div>
			</div>
		</div>
	)
}

export default EntryPercent
