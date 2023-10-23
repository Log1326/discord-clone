'use client'
import { Channel, ChannelType, Server } from '@prisma/client'
import { MemberRole } from '.prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ActionTooltip } from '@/components/action-tooltip'
import { Edit, Hash, Lock, LucideIcon, Mic, Trash, Video } from 'lucide-react'
import { ModalType, useModal } from '@/hooks/use-modal-store'

interface ServerChannelProps {
	channel: Channel
	server: Server
	role?: MemberRole
}
const iconMap: Record<ChannelType, LucideIcon> = {
	[ChannelType.TEXT]: Hash,
	[ChannelType.AUDIO]: Mic,
	[ChannelType.VIDEO]: Video
}
export const ServerChannel: React.FC<ServerChannelProps> = props => {
	const { role, server, channel } = props
	const { onOpen } = useModal()
	const { serverId, channelId } = useParams()
	const { push } = useRouter()
	const Icon = iconMap[channel.type]
	const onClick = () => push(`/servers/${serverId}/channels/${channel.id}`)
	const onAction = (action: ModalType) => (ev: React.MouseEvent) => {
		ev.stopPropagation()
		onOpen(action, { server, channel })
	}
	return (
		<button
			onClick={onClick}
			className={cn(
				`group p-2 rounded-md flex items-center gap-x-2 w-full
			 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition md-1`,
				channelId === channel?.id && 'bg-zinc-700/20 dark:bg-zinc-700'
			)}
		>
			<Icon className='flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400' />
			<p
				className={cn(
					`line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600
					dark:text-zinc-400 dark:group-hover:text-zinc-300 transition`,
					channelId === channel?.id &&
						'text-primary dark:text-zinc-200 dark:group-hover:text-white'
				)}
			>
				{channel?.name}
			</p>
			{channel?.name !== 'general' && role !== MemberRole.GUEST && (
				<div className='ml-auto flex items-center gap-x-2'>
					<ActionTooltip label='Edit'>
						<Edit
							onClick={onAction('editChannel')}
							className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600
						dark:text-zinc-400 dark:hover:text-zinc-300 transition'
						/>
					</ActionTooltip>
					<ActionTooltip label='Delete'>
						<Trash
							onClick={onAction('deleteChannel')}
							className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-role-600
						dark:text-zinc-400 dark:hover:text-role-300 transition'
						/>
					</ActionTooltip>
				</div>
			)}
			{channel?.name === 'general' && (
				<Lock className='ml-auto w-4 h-4 text-zinc-500 dark:text-	zinc-400' />
			)}
		</button>
	)
}
