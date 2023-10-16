import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Discord | Auth',
	description: 'Discord app | Auth procedure'
}
export default function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	return <div className='grid place-content-center h-full'>{children}</div>
}
