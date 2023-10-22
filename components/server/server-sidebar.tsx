import { findDataChannelAndMembers } from '@/lib/findDataChannelAndMembers'
import { ServerHeader } from '@/components/server/server-header'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ServerSearch } from '@/components/server/server-search'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { Channel, ChannelType, Member, Profile } from '@prisma/client'
import React from 'react'
import { MemberRole } from '.prisma/client'
import { Separator } from '@/components/ui/separator'
import { ServerSection } from '@/components/server/server-section'
import { ServerChannel } from '@/components/server/server-channel'
import { ServerMember } from '@/components/server/server-member'

type DataType = {
	label: string
	type: 'member' | 'channel'
	data: { icon: React.ReactNode; name: string; id: string }[] | undefined
}[]
const iconMap: Record<ChannelType, React.ReactNode> = {
	[ChannelType.TEXT]: <Hash className='mr-2 h-4 w-4' />,
	[ChannelType.AUDIO]: <Mic className='mr-2 h-4 w-4' />,
	[ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4' />
}
const roleIconMap: Record<MemberRole, React.ReactNode | null> = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: (
		<ShieldCheck className='mr-2 h-4 w-4 text-indigo-500' />
	),
	[MemberRole.ADMIN]: <ShieldAlert className='mr-2 h-4 w-4 text-rose-500' />
}
export const ServerSidebar: React.FC<{ serverId: string }> = async ({
	serverId
}) => {
	const { members, role, server, videoChannels, textChannels, audioChannels } =
		await findDataChannelAndMembers(serverId)
	const data: DataType = [
		{
			label: 'Text Channels',
			type: 'channel',
			data: textChannels?.map((channel: Channel) => ({
				id: channel.id,
				name: channel.name,
				icon: iconMap[channel.type]
			}))
		},
		{
			label: 'Voice Channels',
			type: 'channel',
			data: audioChannels?.map((channel: Channel) => ({
				id: channel.id,
				name: channel.name,
				icon: iconMap[channel.type]
			}))
		},
		{
			label: 'Video Channels',
			type: 'channel',
			data: videoChannels?.map((channel: Channel) => ({
				id: channel.id,
				name: channel.name,
				icon: iconMap[channel.type]
			}))
		},
		{
			label: 'Members',
			type: 'member',
			data: members?.map((member: Member & { profile: Profile }) => ({
				id: member.id,
				name: member.profile.name,
				icon: roleIconMap[member.role]
			}))
		}
	]
	return (
		<div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
			<ServerHeader server={server} role={role} />
			<ScrollArea className='flex-1 px-3'>
				<div className='mt-2'>
					<ServerSearch data={data} />
				</div>
				<Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
				{!!textChannels && (
					<div className='mt-2'>
						<ServerSection
							role={role}
							label='Text channels'
							sectionType='channels'
							channelType={ChannelType.TEXT}
						/>
						{textChannels.map((channel: Channel) => (
							<ServerChannel
								key={channel.id}
								server={server}
								channel={channel}
								role={role}
							/>
						))}
					</div>
				)}
				{!!audioChannels && (
					<div className='mt-2'>
						<ServerSection
							role={role}
							label='Voice channels'
							sectionType='channels'
							channelType={ChannelType.AUDIO}
						/>
						{audioChannels.map((channel: Channel) => (
							<ServerChannel
								key={channel.id}
								server={server}
								channel={channel}
								role={role}
							/>
						))}
					</div>
				)}
				{!!videoChannels && (
					<div className='mt-2'>
						<ServerSection
							role={role}
							label='Video channels'
							sectionType='channels'
							channelType={ChannelType.VIDEO}
						/>
						{videoChannels.map((channel: Channel) => (
							<ServerChannel
								key={channel.id}
								server={server}
								channel={channel}
								role={role}
							/>
						))}
					</div>
				)}
				{!!members && (
					<div className='mt-2'>
						<ServerSection
							server={server}
							role={role}
							label='Members'
							sectionType='members'
						/>
						{members.map((member: Member & { profile: Profile }) => (
							<ServerMember key={member.id} server={server} member={member} />
						))}
					</div>
				)}
			</ScrollArea>
		</div>
	)
}
