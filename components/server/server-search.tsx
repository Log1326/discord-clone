'use client'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem
} from '@/components/ui/command'
import { useParams, useRouter } from 'next/navigation'

interface ServerSearchProps {
	data: {
		label: string
		type: 'channel' | 'member'
		data: { icon: React.ReactNode; name: string; id: string }[] | undefined
	}[]
}
export const ServerSearch: React.FC<ServerSearchProps> = props => {
	const { data } = props
	const [isOpen, setIsOpen] = useState(false)
	const router = useRouter()
	const params = useParams()
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setIsOpen(prev => !prev)
			}
		}
		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [])
	const onClick =
		({ id, type }: { type: 'channel' | 'member'; id: string }) =>
		() => {
			setIsOpen(false)
			if (type === 'member')
				return router.push(`/servers/${params?.serverId}/conversation/${id}`)
			if (type === 'channel')
				return router.push(`/servers/${params?.serverId}/channels/${id}`)
			return null
		}
	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className='group px-2 py-2 rounded-md flex items-center gap-x-2
			w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'
			>
				<Search className='w-4 h-4 text-zinc-500 dark:text-zinc-400' />
				<p
					className='font-semibold text-sm text-zinc-500 dark:text-zinc-400
				group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition
				'
				>
					Search
				</p>
				<kbd
					className='pointer-events-none inline-flex h-5 select-none
				items-center ga-1 rounder border bg-muted px-1.5 font-mono text-[10px]
				font-medium text-muted-foreground ml-auto
				'
				>
					<span className='tex-xs'>ctrl+</span>K
				</kbd>
			</button>
			<CommandDialog open={isOpen} onOpenChange={setIsOpen}>
				<CommandInput placeholder='Search all channels and members' />
				<CommandEmpty>No results found</CommandEmpty>
				{data.map(outData => {
					if (!outData.data?.length) return null
					return (
						<CommandGroup key={outData.label} heading={outData.label}>
							{outData.data?.map(innerData => (
								<CommandItem
									key={innerData.id}
									onSelect={onClick({ id: innerData.id, type: outData.type })}
								>
									{innerData.icon}
									<span>{innerData.name}</span>
								</CommandItem>
							))}
						</CommandGroup>
					)
				})}
			</CommandDialog>
		</>
	)
}
