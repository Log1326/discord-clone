import type { Metadata } from 'next'
import { NavigationSidebar } from '@/components/navigation/navigation-sidebar'

export const metadata: Metadata = {
	title: 'Server | General',
	description: 'layout'
}

export default function ServerLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='h-full'>
			<div className='hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0'>
				<NavigationSidebar />
			</div>
			<main className='md:pl-[72px] h-full'>{children}</main>
		</div>
	)
}
