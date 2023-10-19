import { NextResponse } from 'next/server'

type MessageType =
	| 'Internal Error'
	| 'Unauthorized'
	| 'Server ID Missing'
	| 'Member ID Missing'
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
	'Server ID Missing': fn('Server ID Missing', { status: 400 }),
	'Member ID Missing': fn('Member ID Missing', { status: 400 })
}
export const nextError = (message: MessageType) => {
	const err = errorOptions[message]
	return new NextResponse(err.body, err.init)
}
