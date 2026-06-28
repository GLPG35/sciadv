import { AnimatePresence } from 'motion/react'
import GalleryVisualizer from '../GalleryVisualizer'
import { useState } from 'react'

type Props = {
	gallery: [string[], "visible" | "hidden"][],
	title: string,
	spoilerText: [string, string]
}

const GalleryContainer = ({ gallery, title, spoilerText }: Props) => {
	const [viewSS, setViewSS] = useState<number>()
	const [showHidden, setShowHidden] = useState(false)
	
	return (
		<>
			<AnimatePresence>
				{viewSS !== undefined &&
					<GalleryVisualizer {...{viewSS, setViewSS, screenshots: gallery.filter(x => !showHidden ? x[1] === 'visible' : x).map(x => x[0])}} />
				}
			</AnimatePresence>
			<div className="gallery">
				<div className="galleryTitle">
					<h3>{title}</h3>
					{gallery.some(x => x[1] === 'hidden') && <button onClick={() => setShowHidden(!showHidden)}>{!showHidden ? `${spoilerText[0]}` : `${spoilerText[1]}`}</button>}
				</div>
				<div className="pictures">
					{gallery.filter(x => !showHidden ? x[1] === 'visible' : x).map((picture, index) => (
						<div key={picture[0][0] + index} className='picture' onClick={() => setViewSS(index)}>
							<picture>
								{picture[0].map((path, i) => {
									const isLast = picture[0].length === i + 1
									const type = path.split('.').pop()

									if (isLast) return <img key={path} src={path} alt="" loading='lazy' />

									return <source key={path} srcSet={path} type={`image/${type}`} />
								})}
							</picture>
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default GalleryContainer
