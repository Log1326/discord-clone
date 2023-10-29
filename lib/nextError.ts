import { NextResponse } from 'next/server'

type MessageType =
	| 'Internal Error'
	| 'Unauthorized'
	| 'Server ID Missing'
	| 'Member ID Missing'
	| 'Name cannot be general'
	| 'Channel ID Missing'
	| 'Conversation ID Missing'
	| 'Missing "room" query parameter'
	| 'Missing "username" query parameter'
	| 'Server misconfigured'
interface Init {
	body?: BodyInit
	init?: ResponseInit
}
const fn = (body: BodyInit, init: ResponseInit): Init => {
	return { body, init }
}
const errorOptions: Record<MessageType, Init> = {
	Unauthorized: fn('Unauthorized', { status: 401 }),
	'Internal Error': fn('Internal Error', { status: 500 }),
	'Server ID Missing': fn('Server ID Missing', { status: 404 }),
	'Channel ID Missing': fn('Channel ID Missing', { status: 404 }),
	'Member ID Missing': fn('Member ID Missing', { status: 404 }),
	'Conversation ID Missing': fn('Conversation ID Missing', { status: 404 }),
	'Name cannot be general': fn('Name cannot be general', { status: 400 }),
	'Missing "room" query parameter': fn('Missing "room" query parameter', {
		status: 400
	}),
	'Missing "username" query parameter': fn(
		'Missing "username" query parameter',
		{ status: 400 }
	),
	'Server misconfigured': fn('Server misconfigured', { status: 500 })
}
export function nextError(message: MessageType) {
	const err = errorOptions[message]
	return new NextResponse(err.body, err.init)
}
