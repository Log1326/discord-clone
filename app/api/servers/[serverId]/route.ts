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
		const { name, imageUrl } = await req.json()
		if (!profile) return nextError('Unauthorized')
		const server = await db.server.update({
			where: { id: serverId, profileId: profile.id },
			data: { name, imageUrl }
		})
		if (!server) return nextError('Server ID Missing')
		return NextResponse.json(server)
	} catch (err) {
		console.log(err, 'SERVER_ID_PATCH')
		return nextError('Internal Error')
	}
}
export async function DELETE(req: Request, { params: { serverId } }: Params) {
	try {
		const profile = await currentProfile()
		if (!profile) return nextError('Unauthorized')
		const server = await db.server.delete({
			where: { id: serverId, profileId: profile.id }
		})
		if (!server) return nextError('Server ID Missing')
		return NextResponse.json(server)
	} catch (err) {
		console.log(err, 'SERVER_ID_DELETE')
		return nextError('Internal Error')
	}
}
