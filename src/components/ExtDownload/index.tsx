import { useState, type PropsWithChildren } from 'react'
import './styles.scss'

const ExtDownload = ({ href, name, children }: PropsWithChildren<{ href: string, name: string }>) => {
	const [loading, setLoading] = useState(false)
	const [percentage, setPercentage] = useState(0)
	
	const handleClick = async () => {
		setLoading(true)
		const res = await fetch(href)

		const totalSize = parseInt(res.headers.get('content-length') as string, 10)

		if (!res.body) return

		const reader = res.body.getReader()
		let receivedSize = 0
		let lastReportedProgress = 0
		const chunks = []

		while (true) {
			const { done, value } = await reader.read()
			
			if (done) break

			chunks.push(value)
			receivedSize += value.length

			if (totalSize) {
				const currentProgress = Math.floor((receivedSize / totalSize) * 100)

				if (currentProgress > lastReportedProgress) {
					lastReportedProgress = currentProgress
					setPercentage(() => currentProgress)
				}
			}
		}
		
		const blob = new Blob(chunks)
		const blobURL = URL.createObjectURL(blob)

		const link = document.createElement('a')
		link.href = blobURL
		link.download = name
		link.click()

		URL.revokeObjectURL(blobURL)
		setLoading(false)
	}
	
	return (
		<>
			<div className='anchor' onClick={handleClick}>
				{children}
			</div>
			{loading && 
				<>
					<span className="loader"></span>
					<span className='percentage'>{percentage}%</span>
				</>
			}
		</>
	)
}

export default ExtDownload
