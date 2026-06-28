import styles from './styles.module.scss'
import { AnimatePresence, motion } from 'motion/react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType } from 'embla-carousel'
import { useCallback, useEffect, useState } from 'react'

type Props = {
	viewSS: number,
	setViewSS: (state?: number) => void,
	screenshots: string[][]
}

const GalleryVisualizer = ({ viewSS, setViewSS, screenshots }: Props) => {
	const [startSS, setStartSS] = useState(0)
	const [bullet, setBullet] = useState<number>(viewSS)
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: startSS })

	const handleBullets = useCallback((emblaApi: EmblaCarouselType) => {
		setBullet(emblaApi.selectedScrollSnap())
	}, [])

	useEffect(() => {
		setBullet(viewSS)
		setStartSS(viewSS)
	}, [viewSS])

	useEffect(() => {
		if (emblaApi) emblaApi.on('select', handleBullets)
	}, [emblaApi, handleBullets])

	const handleBullet = (index: number) => () => {
		if (emblaApi) emblaApi.scrollTo(index)
	}
	
	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.viewScreenshotsWrapper}>
			<div ref={emblaRef} className={`${styles.viewScreenshots} embla`}>
				<div className={`${styles.screenshots} embla__container`} style={{ width: `${screenshots.length * 100}%` }}>
					{screenshots.map(pictures => (
						<div className={`${styles.screenshot} embla__slide`} key={pictures[0]} onClick={() => setViewSS(undefined)}>
							<div className={styles.pic} onClick={e => e.stopPropagation()}>
								<picture>
									{pictures.map((path, i) => {
										const isLast = pictures.length === i + 1
										const type = path.split('.').pop()

										if (isLast) return <img src={path} alt="" />

										return <source srcSet={path} type={`image/${type}`} />
									})}
								</picture>
							</div>
						</div>
					))}
				</div>
				<motion.div className={styles.bullets}>
					<AnimatePresence initial={false}>
						{(screenshots.length >= 9 ? [...Array(9)].map((_, i) => screenshots.map((_, i) => i)[(bullet - 4 + i + screenshots.length) % screenshots.length]) : screenshots.map((_, i) => i)).map(i => (
							<motion.div layout='position' key={i} className={`${styles.bullet} ${i == bullet ? styles.active : ''}`} onClick={handleBullet(i)}></motion.div>
						))}
					</AnimatePresence>
				</motion.div>
			</div>
		</motion.div>
	)
}

export default GalleryVisualizer
