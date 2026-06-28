import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Title = 'chn' | 'sg' | 'rne' | 'cc' | 'sg0' | 'rnd' | 'ac'
type Entry = {
	title: Title,
	list: string[]
}

interface State {
	sideChecklist: Entry[],
	addToChecklist: (title: Title, uuid: string) => void
}

export const useEntryStore = create<State>()(persist((set, get) => ({
	sideChecklist: [],
	addToChecklist: (title, uuid) => {
		const { sideChecklist } = get()

		const findTitleIndex = sideChecklist.findIndex(x => x.title === title)

		if (findTitleIndex === -1) {
			const newEntry = {
				title,
				list: [uuid]
			}
			
			return set({ sideChecklist: [ ...sideChecklist, newEntry ] })
		}

		const findListIndex = sideChecklist[findTitleIndex].list.findIndex(x => x === uuid)
		
		if (findListIndex !== -1) {
			const newList = [...sideChecklist]
			newList[findTitleIndex].list.splice(findListIndex, 1)
			
			return set({ sideChecklist: [ ...newList ] })
		}

		const newList = [...sideChecklist]
		newList[findTitleIndex].list.push(uuid)
		
		set({ sideChecklist: [ ...newList ] })
	}
}), { name: 'sideChecklist' }))
