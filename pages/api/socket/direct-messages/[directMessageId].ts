import { NextApiRequest } from 'next'
import { NextApiResponseServerIo } from '@/types'
import { currentProfilePages } from '@/lib/current-profile-pages'
import { db } from '@/lib/db'
import { MemberRole } from '.prisma/client'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIo
) {
	if (req.method !== 'DELETE' && req.method !== 'PATCH')
		return res.status(405).json({ error: 'Method not allowed ' })
	try {
		const profile = await currentProfilePages(req)
		const { directMessageId, conversationId } = req.query
		const { content } = req.body
		if (!profile) return res.status(401).json({ error: 'Unauthorized' })
		if (!directMessageId)
			return res.status(400).json({ error: 'Direct message ID Missing' })
		if (!conversationId)
			return res.status(400).json({ error: 'Conversation ID Missing' })
		const conversation = await db.conversation.findFirst({
			where: {
				id: String(conversationId),
				OR: [
					{ memberOne: { profileId: profile.id } },
					{ memberTwo: { profileId: profile.id } }
				]
			},
			include: {
				memberOne: { include: { profile: true } },
				memberTwo: { include: { profile: true } }
			}
		})
		if (!conversation)
			return res.status(404).json({ message: 'Conversation not found' })
		const member =
			conversation.memberOne.profileId === profile.id
				? conversation.memberOne
				: conversation.memberTwo

		if (!member) return res.status(404).json({ error: 'Member not found' })
		let directMessage = await db.directMessage.findFirst({
			where: {
				id: String(directMessageId),
				conversationId: String(conversationId)
			},
			include: {
				member: { include: { profile: true } }
			}
		})
		if (!directMessage || directMessage.deleted)
			return res.status(404).json({ error: 'Message not found' })
		const isMessageOwner = directMessage.memberId === member.id
		const isAdmin = member.role === MemberRole.ADMIN
		const isModerator = member.role === MemberRole.MODERATOR
		const canModify = isMessageOwner || isAdmin || isModerator
		if (!canModify) return res.status(401).json({ error: 'Unauthorized' })
		if (req.method === 'DELETE')
			directMessage = await db.directMessage.update({
				where: { id: String(directMessageId) },
				data: {
					fileUrl: null,
					content: 'This message has been deleted.',
					deleted: true
				},
				include: { member: { include: { profile: true } } }
			})
		if (req.method === 'PATCH') {
			if (!isMessageOwner)
				return res.status(401).json({ error: 'Unauthorized' })
			directMessage = await db.directMessage.update({
				where: { id: String(directMessageId) },
				data: {
					content
				},
				include: { member: { include: { profile: true } } }
			})
		}
		const updateKey = `chat:${conversationId}:messages:update`
		res.socket.server.io.emit(updateKey, directMessage)
		return res.status(200).json(directMessage)
	} catch (err) {
		console.log(err, 'SOCKET_DIRECT_MESSAGE_PATCH_DELETE')
		return res.status(500).json({ message: 'Internal Error' })
	}
}
