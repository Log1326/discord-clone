import { nextError } from '@/lib/nextError'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { MemberRole } from '.prisma/client'

type Params = {
	params: { channelId: string }
}
export async function DELETE(req: Request, { params: { channelId } }: Params) {
	try {
		const profile = await currentProfile()
		const serverId = new URL(req.url).searchParams.get('serverId')
		if (!profile) return nextError('Unauthorized')
		if (!serverId) return nextError('Server ID Missing')
		if (!channelId) return nextError('Channel ID Missing')
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
			data: {
				channels: { delete: { id: channelId, name: { not: 'general' } } }
			}
		})
		return NextResponse.json(server)
	} catch (err) {
		console.log(err, 'CHANNEL_ID_DELETE')
		return nextError('Internal Error')
	}
}

export async function PATCH(req: Request, { params: { channelId } }: Params) {
	try {
		const profile = await currentProfile()
		const serverId = new URL(req.url).searchParams.get('serverId')
		const { name, type } = await req.json()
		if (!profile) return nextError('Unauthorized')
		if (!serverId) return nextError('Server ID Missing')
		if (!channelId) return nextError('Channel ID Missing')
		if (name === 'general') return nextError('Name cannot be general')
		const server = await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile?.id,
						role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] }
					}
				}
			},
			data: {
				channels: {
					update: {
						where: { id: channelId, NOT: { name: 'general' } },
						data: { name, type }
					}
				}
			}
		})
		return NextResponse.json(server)
	} catch (err) {
		console.log(err, 'CHANNEL_ID_PATCH')
		return nextError('Internal Error')
	}
}
