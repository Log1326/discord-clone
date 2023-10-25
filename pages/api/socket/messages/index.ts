import { NextApiRequest } from 'next'
import { currentProfilePages } from '@/lib/current-profile-pages'
import { db } from '@/lib/db'
import { NextApiResponseServerIo } from '@/types'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIo
) {
	if (req.method !== 'POST')
		return res.status(405).json({ error: 'Method is mot allowed' })
	try {
		const profile = await currentProfilePages(req)
		const { content, fileUrl } = req.body
		const { serverId, channelId } = req.query
		if (!profile) return res.status(401).json({ message: 'Unauthorized' })
		if (!channelId)
			return res.status(401).json({ message: 'Channel ID Missing' })
		if (!serverId) return res.status(401).json({ message: 'Server ID Missing' })
		if (!content) return res.status(401).json({ message: 'Content is missing' })
		const server = await db.server.findFirst({
			where: {
				id: String(serverId),
				members: { some: { profileId: profile?.id } }
			},
			include: { members: true }
		})
		if (!server) return res.status(404).json({ message: 'Server not found' })
		const channel = await db.channel.findFirst({
			where: { id: String(channelId), serverId: String(serverId) }
		})
		if (!channel) return res.status(404).json({ message: 'Channel not found' })
		const member = server.members.find(
			member => member.profileId === profile.id
		)
		if (!member) return res.status(404).json({ message: 'Member not found' })
		const message = await db.message.create({
			data: {
				content,
				fileUrl,
				channelId: String(channelId),
				memberId: member.id
			},
			include: { member: { include: { profile: true } } }
		})
		const channelKey = `chat:${channelId}:messages`
		res?.socket?.server?.io.emit(channelKey, message)
		return res.status(200).json(message)
	} catch (err) {
		console.log(err, 'MESSAGE_POST')
		return res.status(500).json({ message: 'Internal Error' })
	}
}
