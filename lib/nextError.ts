import { NextResponse } from 'next/server'

export function nextError(message: string, init: ResponseInit) {
	return new NextResponse(message, init)
}
