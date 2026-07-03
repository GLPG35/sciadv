import { useEntryStore, usePasswordStore, type Title } from '../../../store/entryStore'
import { memo, useState } from 'react'
import '../styles.scss'
import { LuCheck, LuArrowRight } from 'react-icons/lu'
import ExtDownload from '../../ExtDownload'
import { getLangFromUrl, useTranslatedPath } from '../../../i18n/utils'

type SideContentType = typeof import('../../../utils/sidecontent_es.json')
type List = SideContentType[number]['list']

const typeDict = {
	'anime': 'Anime',
	'animeova': 'Anime OVA',
	'animeona': 'Anime ONA',
	'animemovie': 'Anime Película',
	'stageplay': 'Obra Teatral',
	'manga': 'Manga',
	'lightnovel': 'Novela Ligera',
	'shortstory': 'Historia Corta',
	'visualnovel': 'Novela Visual',
	'dramacd': 'Drama CD',
	'book': 'Libro'
}

const SideContent = memo(({ entryTitle, content: { uuid, title, date, finishDate, essential, notRecommended, incomplete, type, urls, hidden, notes, hiddenNotes, must }, isChecked, url }: { entryTitle: Title, content: List[number], isChecked: boolean, url: URL }) => {
	const currentLang = getLangFromUrl(url)
	const translatePath = useTranslatedPath(currentLang)
	const addToChecklist = useEntryStore(state => state.addToChecklist)
	const unlocked = usePasswordStore(state => state.unlocked)
	const isDate = date.includes('-')
	const [fullYear, month, day] = date.split('-')
	const parseDate = isDate ? Intl.DateTimeFormat('es', { dateStyle: 'long' }).format(new Date(+fullYear, +month - 1, +day)) : date
	const isDate2 = finishDate?.includes('-')
	const [fullYear2, month2, day2] = finishDate ? finishDate.split('-') : [0, 0, 0]
	const parseDate2 = isDate2 ? Intl.DateTimeFormat('es', { dateStyle: 'long' }).format(new Date(+fullYear2, +month2 - 1, +day2)) : finishDate

	return <div className='content'>
		<div className="check" key={`${uuid}`}>
			<input type="checkbox" checked={isChecked} readOnly />
			<button className="checkbox" onClick={() => addToChecklist(entryTitle, uuid)}>
				<div className='icon'><LuCheck strokeWidth={5} /></div>
			</button>
		</div>
		<div className="data">
			<div className="title" onClick={() => addToChecklist(entryTitle, uuid)}>
				<div className='titleWrapper'>
					<div className="name">{title}</div>
				</div>
				<div className="date">{parseDate}{finishDate && ` - ${parseDate2}`}</div>
				{must && <div className='must types'>
					<div className='type'>Prerrequisito</div>
					<div className="links" onClick={e => e.stopPropagation()}>
						<LuArrowRight strokeWidth={3} style={{ cursor: 'initial' }} />
						<a href={translatePath(must.link)}>{must.name}</a>
					</div>
				</div>}
				<div className="types">
					{essential && <div className='type essential'>Esencial</div>}
					{notRecommended && <div className='type notRecommended'>No Recomendado</div>}
					{incomplete && <div className='type incomplete'>Incompleto</div>}
					<div className='type'>{typeDict[type as keyof typeof typeDict]}</div>
					{urls.length > 0 &&
						<div className="links" onClick={e => e.stopPropagation()}>
							{!unlocked && !hidden ?
								<>
									<LuArrowRight strokeWidth={3} style={{ cursor: 'initial' }} />
									{urls.map((url, i) => {
										if ('external' in url) {
											return <ExtDownload key={i} href={url.url} name={url.externalName as string}>{url.name}</ExtDownload>
										}
										
										return <a key={i} href={url.url} target='_blank'>{url.name}</a>
									})}
								</>
							: unlocked &&
								<>
									<LuArrowRight strokeWidth={3} style={{ cursor: 'initial' }} />
									{urls.map((url, i) => {
										if ('external' in url) {
											return <ExtDownload key={i} href={url.url} name={url.externalName as string}>{url.name}</ExtDownload>
										}
										
										return <a key={i} href={url.url} target='_blank'>{url.name}</a>
									})}
								</>
							}
						</div>
					}
				</div>
			</div>
			{notes && <div className="notes">
				{(unlocked ? notes : hiddenNotes as string[] || notes).map((note, i) => <p key={i}>{note}</p>)}
			</div>}
		</div>
	</div>
})

const SideContentList = ({ title, list, url }: { title: Title, list: List, url: URL }) => {
	const sideCheckList = useEntryStore(state => state.sideChecklist)
	const [filter, setFilter] = useState<'all'|'essential'|'nonEssential'>('all')
	
	return <>
		<div className="filters">
			<div className="radios">
				<input type="radio" name='filter' checked={filter === 'all'} readOnly />
				<button onClick={() => setFilter('all')}>
					Todo
				</button>
			</div>
			<div className="radios">
				<input type="radio" name='filter' checked={filter === 'essential'} readOnly />
				<button onClick={() => setFilter('essential')}>
					Esencial
				</button>
			</div>
			<div className="radios">
				<input type="radio" name="filter" checked={filter === 'nonEssential'} readOnly />
				<button onClick={() => setFilter('nonEssential')}>
					No esencial
				</button>
			</div>
		</div>
		{list.filter(x => filter !== 'all' ? filter === 'essential' ? x.essential : !x.essential : x).map(content => {
			const sideList = sideCheckList.find(x => x.title === title)
			const isChecked = sideList ? sideList.list.includes(content.uuid) : false

			return <SideContent entryTitle={title} content={content} key={content.uuid} isChecked={isChecked} url={url} />
		})}
	</>
}

export default SideContentList
