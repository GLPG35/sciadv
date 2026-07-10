import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { SiApplemusic, SiMega, SiSpotify, SiSteam } from 'react-icons/si'
import { LuX } from 'react-icons/lu'
import { useMusicStore, usePasswordStore, type AlbumTitle } from '../../store/entryStore'

type MusicContentType = typeof import('../../utils/music.json')
type Album = MusicContentType[number]['list'][number]

const icons = {
	'MEGA': <SiMega />,
	'Spotify': <SiSpotify />,
	'Apple Music': <SiApplemusic />,
	'Steam': <SiSteam />
}

const MusicAlbum = ({ album: { name, date, description, cover, trackList, urls, spoiler }, entryName }: { album: Album, entryName: AlbumTitle }) => {
	const unlocked = usePasswordStore(state => state.unlocked)
	const sectionList = useMusicStore(state => state.sectionList)
	const [modal, setModal] = useState(false)
	const isDate = date.includes('-')
	const [fullYear, month, day] = date.split('-')
	const parseDate = isDate ? Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(+fullYear, +month - 1, +day)) : date
	
	return <>
		<AnimatePresence>
			{modal &&
				<motion.div className='modalContainer' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(false)}>
					<motion.div className="modal scroll" initial={{ x: '110%' }} animate={{ x: '10em' }} exit={{ x: '110%' }} onClick={e => e.stopPropagation()}>
						<div className="close" onClick={() => setModal(false)}>
							<LuX />
						</div>
						<div className="top">
							<div className="cover">
								<picture>
									<source srcSet={!sectionList.includes(entryName) && spoiler ? '/spoiler.avif' : `${cover.split('.')[0]}.avif`} type='image/avif' />
									<source srcSet={!sectionList.includes(entryName) && spoiler ? '/spoiler.webp' : `${cover.split('.')[0]}.webp`} type='image/webp' />
									<img src={!sectionList.includes(entryName) && spoiler ? '/spoiler.jpg' : cover} alt="" />
								</picture>
							</div>
							<div className="title">
								<h3 title={name}>{name}</h3>
								<span>{parseDate}・{description}</span>
							</div>
						</div>
						{urls.some(x => !unlocked ? !x.hidden : x) &&
							<div className="availableIn">
								{urls.filter(x => !unlocked ? !x.hidden : x).map(({ url, name }) => (
									<a href={url} target='_blank'>
										{icons[name as keyof typeof icons]}
										{name}
									</a>
								))}
							</div>
						}
						<div className="sublist">
							<h4>Tracklist</h4>
							<ol>
								{trackList.map(({ name, duration }) => {
									return <li className="track" key={name}>
									<div className="info">
										<div className="name">
											{name}
										</div>
										<div className="duration">
											{duration}
											</div>
										</div>
									</li>
								})}
							</ol>
						</div>
					</motion.div>
				</motion.div>	
			}
		</AnimatePresence>
		<div className="album" onClick={() => setModal(true)}>
			<div className="top">
				<div className="cover">
					<picture>
						<source srcSet={!sectionList.includes(entryName) && spoiler ? '/spoiler.avif' : `${cover.split('.')[0]}.avif`} type='image/avif' />
						<source srcSet={!sectionList.includes(entryName) && spoiler ? '/spoiler.webp' : `${cover.split('.')[0]}.webp`} type='image/webp' />
						<img src={!sectionList.includes(entryName) && spoiler ? '/spoiler.jpg' : cover} alt="" />
					</picture>
				</div>
				<div className="title">
					<h3 title={name}>{name}</h3>
					<span>{parseDate}</span>
				</div>
			</div>
		</div>
	</>
}

export default MusicAlbum
