'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import '@livekit/components-styles'

interface MediaRoomProps {
	chatId: string
	video: boolean
	audio: boolean
}
export const MediaRoom: React.FC<MediaRoomProps> = props => {
	const { audio, video, chatId } = props
	const { user } = useUser()
	const [token, setToken] = useState('')
	useEffect(() => {
		if (!user?.firstName || !user?.lastName) return
		const name = `${user.firstName} ${user.lastName}`
		;(async () => {
			try {
				const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
				const data = await res.json()
				setToken(data.token)
			} catch (err) {
				console.log(err)
			}
		})()
	}, [user?.firstName, user?.lastName, chatId])
	if (!token)
		return (
			<div className='flex flex-col flex-1 justify-center items-center'>
				<Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
				<p className='text-xs text-zinc-500 dark:text-zinc-400'>Booting...</p>
			</div>
		)
	return (
		<LiveKitRoom
			data-lk-theme='default'
			token={token}
			serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
			connect
			video={video}
			audio={audio}
		>
			<VideoConference />
		</LiveKitRoom>
	)
}
