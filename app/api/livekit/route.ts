import { AccessToken } from 'livekit-server-sdk'
import { NextRequest, NextResponse } from 'next/server'
import { nextError } from '../../../lib/nextError'

export async function GET(req: NextRequest) {
	const room = req.nextUrl.searchParams.get('room')
	const username = req.nextUrl.searchParams.get('username')
	if (!room) return nextError('Missing "room" query parameter')
	if (!username) return nextError('Missing "username" query parameter')
	const apiKey = process.env.LIVEKIT_API_KEY
	const apiSecret = process.env.LIVEKIT_API_SECRET
	const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL
	if (!apiKey || !apiSecret || !wsUrl) return nextError('Server misconfigured')
	const at = new AccessToken(apiKey, apiSecret, { identity: username })

	at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true })

	return NextResponse.json({ token: at.toJwt() })
}
