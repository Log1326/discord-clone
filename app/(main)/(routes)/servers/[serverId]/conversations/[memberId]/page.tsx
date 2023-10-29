import { currentProfile } from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { getOrCreateConversation } from '@/lib/conversation'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatMessages } from '@/components/chat/chat-messages'
import { ChatInput } from '@/components/chat/chat-input'
import { MediaRoom } from '@/components/media-room'

type Params = {
	params: {
		memberId: string
		serverId: string
	}
	searchParams: {
		video?: boolean
	}
}
export default async function MemberIdPage({
	params: { memberId, serverId },
	searchParams
}: Params) {
	const profile = await currentProfile()
	if (!profile) return redirectToSignIn()
	const currentMember = await db.member.findFirst({
		where: { serverId, profileId: profile.id },
		include: { profile: true }
	})
	if (!currentMember) return redirect('/')
	const conversation = await getOrCreateConversation(currentMember.id, memberId)
	if (!conversation) return redirect(`/servers/${serverId}`)
	const { memberOne, memberTwo } = conversation
	const otherMember =
		memberOne.profileId === profile?.id ? memberTwo : memberOne
	return (
		<div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
			<ChatHeader
				serverId={serverId}
				name={otherMember.profile.name}
				type='conversation'
				imageUrl={otherMember.profile.imageUrl}
			/>
			{searchParams.video && (
				<MediaRoom chatId={conversation.id} video={true} audio={true} />
			)}
			{!searchParams.video && (
				<>
					<ChatMessages
						name={otherMember.profile.name}
						member={currentMember}
						chatId={conversation.id}
						apiUrl='/api/direct-messages'
						socketUrl='/api/socket/direct-messages'
						socketQuery={{ conversationId: conversation.id }}
						paramKey='conversationId'
						paramValue={conversation.id}
						type='conversation'
					/>
					<ChatInput
						apiUrl='/api/socket/direct-messages'
						query={{ conversationId: conversation.id }}
						name={otherMember.profile.name}
						type='conversation'
					/>
				</>
			)}
		</div>
	)
}
