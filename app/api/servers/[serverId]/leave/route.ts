import { nextError } from '@/lib/nextError'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

type Params = {
	params: { serverId: string }
}
export async function PATCH(req: Request, { params: { serverId } }: Params) {
	try {
		const profile = await currentProfile()
		const profileId = profile?.id
		if (!profile) return nextError('Unauthorized')
		if (!serverId) return nextError('Server ID Missing')
		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: { not: profileId },
				members: { some: { profileId } }
			},
			data: { members: { deleteMany: { profileId } } }
		})
		return NextResponse.json(server)
	} catch (err) {
		console.log(err, 'ERROR_WITH_PATCH_LEAVE')
		return nextError('Internal Error')
	}
}
