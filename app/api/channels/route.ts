import { nextError } from '@/lib/nextError'
import { currentProfile } from '@/lib/current-profile'
import { ChannelType } from '@prisma/client'
import { db } from '@/lib/db'
import { MemberRole } from '.prisma/client'
import { NextResponse } from 'next/server'

type Body = {
	name: string
	type: ChannelType
}
export async function POST(req: Request) {
	try {
		const profile = await currentProfile()
		const { type, name } = (await req.json()) as Body
		const serverId = new URL(req.url).searchParams.get('serverId')
		if (!profile) return nextError('Unauthorized')
		if (!serverId) return nextError('Server ID Missing')
		if (name === 'general') nextError('Name cannot be general')
		const server = await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] }
					}
				}
			},
			data: { channels: { create: { profileId: profile.id, name, type } } }
		})
		return NextResponse.json(server)
	} catch (err) {
		console.log(err, 'ERROR_WITH_POST_CHANNEL')
		return nextError('Internal Error')
	}
}
