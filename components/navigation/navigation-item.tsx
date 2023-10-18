'use client'

import { ActionTooltip } from '@/components/action-tooltip'
import { cn } from '@/lib/utils'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

interface NavigationItemProps {
	id: string
	name: string
	imageUrl: string
}
export const NavigationItem: React.FC<NavigationItemProps> = props => {
	const { name, id, imageUrl } = props
	const params = useParams()
	const router = useRouter()
	const onClick = () => router.push(`/servers/${id}`)
	return (
		<ActionTooltip label={name} side='right' align='center'>
			<button onClick={onClick} className='group relative flex items-center'>
				<div
					className={cn(
						'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
						params?.serverId !== id && 'group-hover:h-[20px]',
						params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
					)}
				/>
				<div
					className={cn(
						'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] ' +
							'group-hover:rounded-[16px] transition-all overflow-hidden',
						params?.serverId === id && 'bg-primary/10 rounded-[16px]'
					)}
				>
					<Image src={imageUrl} alt='Channel' fill />
				</div>
			</button>
		</ActionTooltip>
	)
}