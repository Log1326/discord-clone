import { findDataChannelAndMembers } from '@/lib/findDataChannelAndMembers'
import { ServerHeader } from '@/components/server/server-header'

export const ServerSidebar: React.FC<{ serverId: string }> = async ({
	serverId
}) => {
	const { members, role, server, videoChannels, textChannels, audioChannels } =
		await findDataChannelAndMembers(serverId)
	return (
		<div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
			<ServerHeader server={server} role={role} />
		</div>
	)
}
