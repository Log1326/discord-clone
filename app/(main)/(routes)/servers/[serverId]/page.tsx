import { currentProfile } from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface ServerIdPageProps {
	params: { serverId: string }
}
export default async function ServerIdPage({
	params: { serverId }
}: ServerIdPageProps) {
	const profile = await currentProfile()
	if (!profile) return redirectToSignIn()
	const server = await db.server.findUnique({
		where: { id: serverId, members: { some: { profileId: profile?.id } } },
		include: {
			channels: { where: { name: 'general' }, orderBy: { createdAt: 'asc' } }
		}
	})
	const initialChannel = server?.channels.at(0)
	if (initialChannel?.name !== 'general') return null
	return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`)
}
