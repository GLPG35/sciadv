import { useMusicStore, type AlbumTitle } from "../../store/entryStore"

const MusicSpoilers = ({ album, hide, show }: { album: AlbumTitle, hide: string, show: string }) => {
	const sectionList = useMusicStore(state => state.sectionList)
	const addToList = useMusicStore(state => state.addToList)

	return <button className="spoilersButton" onClick={() => addToList(album)}>{sectionList.includes(album) ? hide : show}</button>
}

export default MusicSpoilers
