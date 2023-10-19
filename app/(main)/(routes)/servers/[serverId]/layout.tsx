import type { Metadata } from 'next'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { ServerSidebar } from '@/components/server/server-sidebar'

export const metadata: Metadata = {
	title: 'Server | ID',
	description: 'server id'
}

export default async function ServerIdLayout({
	children,
	params: { serverId }
}: {
	children: React.ReactNode
	params: { serverId: string }
}) {
	const profile = await currentProfile()
	const server = await db.server.findUnique({
		where: { id: serverId, members: { some: { profileId: profile?.id } } }
	})
	if (!server) return redirect('/')
	return (
		<div className='h-full'>
			<div className='hidden md:flex h-full w-72 z-20 flex-col fixed inset-y-0'>
				<ServerSidebar serverId={serverId} />
			</div>
			<main className='h-full md:pl-72'>{children}</main>
		</div>
	)
}
