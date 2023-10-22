import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'
import { redirectToSignIn } from '@clerk/nextjs'

export async function findDataChannelAndMembers(serverId: string) {
	const profile = await currentProfile()
	if (!profile) return redirectToSignIn()
	const server = await db.server.findUnique({
		where: { id: serverId },
		include: {
			channels: { orderBy: { createdAt: 'asc' } },
			members: { include: { profile: true }, orderBy: { role: 'asc' } }
		}
	})
	const textChannels = server?.channels.filter(
		channel => channel.type === ChannelType.TEXT
	)
	const audioChannels = server?.channels.filter(
		channel => channel.type === ChannelType.AUDIO
	)
	const videoChannels = server?.channels.filter(
		channel => channel.type === ChannelType.VIDEO
	)
	const members = server?.members.filter(
		member => member.profileId !== profile.id
	)
	if (!server) redirect('/')
	const role = server.members.find(
		member => member.profileId === profile.id
	)?.role
	return { textChannels, audioChannels, videoChannels, members, role, server }
}
