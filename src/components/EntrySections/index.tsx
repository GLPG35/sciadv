import { Fragment } from 'react'
import { usePasswordStore } from '../../store/entryStore'
import ExtDownload from '../ExtDownload'

type EntryType = typeof import('../../utils/entries.json')

export const Downloads = ({ downloads }: { downloads: EntryType[number]['downloads'] }) => {
	const unlocked = usePasswordStore(state => state.unlocked)
	
	return downloads.map((platform, i) => {
		if (!unlocked && "hidden" in platform) {
			return <Fragment key={i + platform.platform}>
				{platform.hiddenUrl && <li>{platform.hiddenUrl}</li>}
				{platform.hiddenNotes && platform.hiddenNotes.map(note => <span key={note}>{note}</span>)}
			</Fragment>
		}
	
		if ("urls" in platform) {
			return <li key={i + platform.platform}>
				{`${platform.platform} ${i === 0 ? '(Recommended) ' : ' '}`}
				{(platform.urls as { url: string, name: string }[]).map((url, i) => <Fragment key={i + url.name}>
					<a href={url.url} target="_blank">{url.name}</a>
					{i !== platform.urls.length - 1 && ' '}
				</Fragment>)}
			</li>
		}

		if ("notes" in platform) {
			return <Fragment key={i + platform.platform}>
				<li><a href={platform.url} target='_blank'>{platform.platform}</a> {i === 0 ? '(Recommended)' : ''}</li>
				{platform.notes?.map((note) => <span key={note.substring(0, 10)}>{note}</span>)}
			</Fragment>
		}

		return <li key={i + platform.platform}><a href={platform.url} target='_blank'>{platform.platform}</a> {i === 0 ? '(Recommended)' : ''}</li>
	})
}

export const DownloadsEs = ({ downloads }: { downloads: EntryType[number]['downloads'] }) => {
	const unlocked = usePasswordStore(state => state.unlocked)
	
	return downloads.map((platform, i) => {
		if (!unlocked && "hidden" in platform) {
			return <Fragment key={i + platform.platform}>
				{platform.hiddenUrl && <li>{platform.hiddenUrl}</li>}
				{platform.hiddenNotes && platform.hiddenNotes.map(note => <span key={note}>{note}</span>)}
			</Fragment>
		}
	
		if ("urls" in platform) {
			return <li key={i + platform.platform}>
				{`${platform.platform} ${i === 0 ? '(Recomendado) ' : ' '}`}
				{(platform.urls as { url: string, name: string }[]).map((url, i) => <Fragment key={i + url.name}>
					<a href={url.url} target="_blank">{url.name}</a>
					{i !== platform.urls.length - 1 && ' '}
				</Fragment>)}
			</li>
		}

		if ("notes" in platform) {
			return <Fragment key={i + platform.platform}>
				<li><a href={platform.url} target='_blank'>{platform.platform}</a> {i === 0 ? '(Recomendado)' : ''}</li>
				{platform.notes?.map((note) => <span key={note.substring(0, 10)}>{note}</span>)}
			</Fragment>
		}

		return <li key={i + platform.platform}><a href={platform.url} target='_blank'>{platform.platform}</a> {i === 0 ? '(Recomendado)' : ''}</li>
	})
}

export const LightNovel = ({ lightNovel }: { lightNovel: NonNullable<EntryType[number]['lightNovel']> }) => {
	const unlocked = usePasswordStore(state => state.unlocked)
	
	return lightNovel.map(({ name, link, url, link2, url2, external, hidden }, i) => {
		if (!unlocked && hidden) {
			return null
		}
		
		if (external) {
			const links = [
				{
					link: link,
					url: url
				},
				{
					link: link2,
					url: url2
				}
			]
		
			return <li key={i}>{name} <ExtDownload href={links[external.index].url} name={external.name}>{links[external.index].link}</ExtDownload> <a href={links[(external.index + 1) % links.length].url} target="_blank">{links[(external.index + 1) % links.length].link}</a></li>
		}
	
		return <li key={i}>{name} <a href={url} target="_blank">{link}</a> {link2 && url2 && <a href={url2} target="_blank">{link2}</a>}</li>
	})
}

export const Anime = ({ anime }: { anime: NonNullable<EntryType[number]['anime']> }) => {
	const unlocked = usePasswordStore(state => state.unlocked)
	
	return anime.map(({ name, link, url, hidden, hiddenUrl, hiddenNotes }, i) => {
		if (hidden && !unlocked) {
			return <Fragment key={i + name}>
				<li>{hiddenUrl.name} <a href={hiddenUrl.url} target='_blank'>{hiddenUrl.link}</a></li>
				{hiddenNotes && hiddenNotes.map((note, i) => <span key={i}>{note}</span>)}
			</Fragment>
		}
		
		return <li key={i + name}>{name} <a href={url} target="_blank">{link}</a></li>
	})
}

export const Manga = ({ manga }: { manga: NonNullable<EntryType[number]['manga']> }) => {
	const unlocked = usePasswordStore(state => state.unlocked)
	
	return manga.map(({ name, link, url, urls, link2, url2, external, hidden }) => {
		if (hidden && !unlocked) {
			return null
		}
		
		if (urls) {
			return <li key={name + link}>
				{name} {urls.map(url => <Fragment key={url.name}><a href={url.url}>{url.name}</a> </Fragment>)}
			</li>
		}
		
		if (external) {
			const links = [
				{
					link: link,
					url: url
				},
				{
					link: link2,
					url: url2
				}
			]
		
			return <li key={name + link}>{name} <ExtDownload href={links[external.index].url} name={external.name}>{links[external.index].link}</ExtDownload> <a href={links[(external.index + 1) % links.length].url} target="_blank">{links[(external.index + 1) % links.length].link}</a></li>
		}
	
		return <li key={name + link}>{name} <a href={url} target="_blank">{link}</a> {link2 && url2 && <a href={url2} target="_blank">{link2}</a>}</li>
	})
}
