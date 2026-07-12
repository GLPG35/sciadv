import { LuArrowRight } from "react-icons/lu"
import { usePasswordStore } from "../../store/entryStore"

const MusicAll = ({ url, text }: { url: string, text: string }) => {
	const unlocked = usePasswordStore(state => state.unlocked)

	if (!unlocked) return null
	
	return <div className="allAlbums">
		<LuArrowRight />
		<a href={url} target="_blank">{text}</a>
	</div>
}

export default MusicAll
