'use client'
import { useEffect, useState } from 'react'
import { ModalType, useModal } from '@/hooks/use-modal-store'

import { CreateServerModal } from '@/components/modals/create-server-modal'
import { InviteModal } from '@/components/modals/invite-modal'
import { EditServerModal } from '@/components/modals/edti-server-modal'
import { MembersModal } from '@/components/modals/members-modal'
import { CreateChannelModal } from '@/components/modals/create-channel-modal'
import { LeaveServerModal } from '@/components/modals/leave-server-modal'
import { DeleteServerModal } from '@/components/modals/delete-server-modal'
import { DeleteChannelModal } from '@/components/modals/delete-channel-modal'
import { EditChannelModal } from '@/components/modals/edit-channel-modal'
import { MessageFileModal } from '@/components/modals/message-file-modal'
import { DeleteMessageModal } from '@/components/modals/delete-message-modal'

const mapComponents: Record<ModalType, React.ReactElement> = {
	createServer: <CreateServerModal />,
	createChannel: <CreateChannelModal />,
	editChannel: <EditChannelModal />,
	editServer: <EditServerModal />,
	deleteChannel: <DeleteChannelModal />,
	deleteServer: <DeleteServerModal />,
	invite: <InviteModal />,
	members: <MembersModal />,
	leaveServer: <LeaveServerModal />,
	messageFile: <MessageFileModal />,
	deleteMessage: <DeleteMessageModal />
}
export const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false)
	const { type } = useModal()
	useEffect(() => {
		setIsMounted(true)
	}, [])
	if (!isMounted || !type) return null
	return mapComponents[type]
}
