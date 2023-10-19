import { nextError } from '@/lib/nextError'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

export async function PATCH(
	req: Request,
	{ params: { serverId } }: { params: { serverId: string } }
) {
	try {
		const profile = await currentProfile()
		if (!profile) return nextError('Unauthorized')
		if (!serverId) return nextError('Server ID Missing')
		const server = await db.server.update({
			where: { id: serverId, profileId: profile?.id },
			data: {
				inviteCode: uuidv4()
			}
		})
		return NextResponse.json(server)
	} catch (err) {
		console.log(err, 'SERVER ID PATCH')
		return nextError('Internal Error')
	}
}
