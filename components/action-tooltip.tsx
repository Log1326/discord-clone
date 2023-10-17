'use client'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'

type SideType = 'top' | 'right' | 'left' | 'bottom'
type AlignType = 'start' | 'center' | 'end'
interface ActionTooltipProps {
	label: string
	children: React.ReactNode
	side?: SideType
	align?: AlignType
}
export const ActionTooltip: React.FC<ActionTooltipProps> = props => {
	const { align = 'start', side = 'top', children, label = '' } = props
	return (
		<TooltipProvider>
			<Tooltip delayDuration={50}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent side={side} align={align}>
					<p className='font-semibold text-sm capitalize'>
						{label.toLowerCase()}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
