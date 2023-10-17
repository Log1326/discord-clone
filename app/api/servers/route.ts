import { nextError } from '@/lib/nextError'
import { MemberRole } from '.prisma/client'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const { name, imageUrl } = await req.json()
		const profile = await currentProfile()
		if (!profile) nextError('Unauthorized', { status: 401 })
		const server = await db.server.create({
			data: {
				profileId: String(profile?.id),
				name,
				imageUrl,
				inviteCode: uuidv4(),
				channels: {
					create: [{ name: 'general', profileId: String(profile?.id) }]
				},
				members: {
					create: [{ profileId: String(profile?.id), role: MemberRole.ADMIN }]
				}
			}
		})
		return NextResponse.json(server)
	} catch (err) {
		console.log(err, '[SERVERS_POST]')
		nextError('Internal Error', { status: 500 })
	}
}
