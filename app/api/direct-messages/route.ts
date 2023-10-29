import { nextError } from '@/lib/nextError'
import { currentProfile } from '@/lib/current-profile'
import { DirectMessage } from '@prisma/client'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

const MESSAGES_BATCH = 10
export async function GET(req: Request) {
	try {
		const profile = await currentProfile()
		const { searchParams } = new URL(req.url)
		const cursor = searchParams.get('cursor')
		const conversationId = searchParams.get('conversationId')
		if (!profile) return nextError('Unauthorized')
		if (!conversationId) return nextError('Conversation ID Missing')
		let messages: DirectMessage[] = []
		if (cursor)
			messages = await db.directMessage.findMany({
				take: MESSAGES_BATCH,
				skip: 1,
				cursor: { id: cursor },
				where: { conversationId },
				include: { member: { include: { profile: true } } },
				orderBy: { createdAt: 'desc' }
			})
		else
			messages = await db.directMessage.findMany({
				take: MESSAGES_BATCH,
				where: { conversationId },
				include: { member: { include: { profile: true } } },
				orderBy: { createdAt: 'desc' }
			})
		let nextCursor = null
		if (messages.length === MESSAGES_BATCH)
			nextCursor = messages[MESSAGES_BATCH - 1].id
		return NextResponse.json({ items: messages, nextCursor })
	} catch (err) {
		console.log(err, 'DIRECT_ERROR_MESSAGES')
		return nextError('Internal Error')
	}
}
