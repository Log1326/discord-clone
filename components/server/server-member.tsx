'use client'
import { Member, Profile, Server } from '@prisma/client'
import { MemberRole } from '.prisma/client'
import React from 'react'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserAvatar } from '@/components/user-avatar'

interface ServerMemberProps {
	member: Member & { profile: Profile }
	server: Server
}
const roleIconMap: Record<MemberRole, React.ReactNode | null> = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: (
		<ShieldCheck className='ml-2 h-4 w-4 text-indigo-500' />
	),
	[MemberRole.ADMIN]: <ShieldAlert className='ml-2 h-4 w-4 text-rose-500' />
}
export const ServerMember: React.FC<ServerMemberProps> = props => {
	const { member } = props
	const { serverId, memberId, channelId } = useParams()
	const { push } = useRouter()
	const icon = roleIconMap[member.role]
	const onClick = () => push(`/servers/${serverId}/conversations/${member.id}`)

	return (
		<button
			onClick={onClick}
			className={cn(
				`group p-2 rounded-md flex items-center gap-x-2 w-full
			 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition md-1`,
				memberId === member?.id && 'bg-zinc-700/20 dark:bg-zinc-700'
			)}
		>
			<UserAvatar src={member.profile.imageUrl} className='h-8 w-8' />
			<p
				className={cn(
					`font-semibold text-sm text-zinc-500 group-hover:text-zinc-600
					dark:text-zinc-400 dark:group-hover:text-zinc-300 transition`,
					channelId === member?.id &&
						'text-primary dark:text-zinc-200 dark:group-hover:text-white'
				)}
			>
				{member.profile.name}
			</p>
			{icon}
		</button>
	)
}
