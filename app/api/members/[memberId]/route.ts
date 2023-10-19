import { nextError } from '@/lib/nextError'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

type Params = {
	params: { memberId: string }
}
export async function DELETE(req: Request, { params: { memberId } }: Params) {
	try {
		const profile = await currentProfile()
		const serverId = new URL(req.url).searchParams.get('serverId')
		if (!serverId) return nextError('Server ID Missing')
		if (!memberId) return nextError('Member ID Missing')
		if (!profile) return nextError('Unauthorized')
		const server = await db.server.update({
			where: { id: serverId, profileId: profile.id },
			data: {
				members: {
					deleteMany: { id: memberId, profileId: { not: profile.id } }
				}
			},
			include: {
				members: { include: { profile: true }, orderBy: { role: 'asc' } }
			}
		})
		return NextResponse.json(server)
	} catch (err) {
		console.log('MEMBER_ID_ERROR')
		return nextError('Internal Error')
	}
}
export async function PATCH(req: Request, { params: { memberId } }: Params) {
	try {
		const profile = await currentProfile()
		const { searchParams } = new URL(req.url)
		const { role } = await req.json()
		const serverId = searchParams.get('serverId')
		if (!profile) return nextError('Unauthorized')
		if (!serverId) return nextError('Server ID Missing')
		if (!memberId) return nextError('Member ID Missing')
		const server = await db.server.update({
			where: { id: serverId, profileId: profile.id },
			data: {
				members: {
					update: {
						where: { id: memberId, profileId: { not: profile.id } },
						data: { role }
					}
				}
			},
			include: {
				members: { include: { profile: true }, orderBy: { role: 'asc' } }
			}
		})
		return NextResponse.json(server)
	} catch (err) {
		console.log(err, 'MEMBER_ID_PATCH')
		return nextError('Unauthorized')
	}
}
