'use client'
import * as z from 'zod'
import Image from 'next/image'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { MemberRole } from '.prisma/client'
import { Member, Profile } from '@prisma/client'
import { UserAvatar } from '@/components/user-avatar'
import { ActionTooltip } from '@/components/action-tooltip'
import {
	Edit,
	FileScan,
	FileText,
	Loader2,
	ShieldAlert,
	ShieldCheck,
	Trash
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import qs from 'query-string'
import axios from 'axios'

interface ChatItemProps {
	id: string
	content: string
	member: Member & { profile: Profile }
	timestamp: string
	fileUrl: string | null
	deleted: boolean
	currentMember: Member
	isUpdated: boolean
	socketUrl: string
	socketQuery: Record<string, string>
}
const formSchema = z.object({ content: z.string().min(1) })
const roleIconMap: Record<MemberRole, React.ReactNode | null> = {
	GUEST: null,
	MODERATOR: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
	ADMIN: <ShieldAlert className='h-4 w-4 ml-2 text-rose-500' />
}
export const ChatItem: React.FC<ChatItemProps> = props => {
	const {
		deleted,
		fileUrl,
		socketUrl,
		socketQuery,
		currentMember,
		member,
		isUpdated,
		timestamp,
		id,
		content
	} = props
	const [isEditing, setIsEditing] = useState(false)
	const [isDeleted, setIsDeleted] = useState(false)
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' || event.keyCode === 27) setIsEditing(false)
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { content: '' }
	})
	const isLoading = form.formState.isSubmitting
	useEffect(() => {
		form.reset({ content })
	}, [content])
	const fileType = fileUrl?.split('.').pop()
	const isAdmin = currentMember.role === MemberRole.ADMIN
	const isModerator = currentMember.role === MemberRole.MODERATOR
	const isOwner = currentMember.id === member.id
	const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
	const canEditMessage = !deleted && isOwner && !fileUrl
	const isPDFFile = fileType === 'pdf' && fileUrl
	const isTEXTFile = fileType === 'text' && fileUrl
	const isImage = !isPDFFile && !isTEXTFile && fileUrl
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: `${socketUrl}/${id}`,
				query: socketQuery
			})
			await axios.patch(url, values)
			form.reset()
			setIsEditing(false)
		} catch (err) {
			console.log(err)
		}
	}
	return (
		<div className='relative group flex items-center hover:bg-black/5 p-8 transition w-full overflow-x-hidden'>
			<div className='group flex gap-x-2 items-start w-full'>
				<div className='cursor-pointer hover:drop-shadow-md transition'>
					<UserAvatar src={member.profile.imageUrl} />
				</div>
				<div className='flex flex-col w-full'>
					<div className='flex items-center gap-x-2'>
						<div className='flex items-center'>
							<p className='font-semibold text-sm hover:underline cursor-pointer'>
								{member.profile.name}
							</p>
							<ActionTooltip label={member.role}>
								{roleIconMap[member.role]}
							</ActionTooltip>
						</div>
						<span className='text-xs text-zinc-500 dark:text-zinc-400'>
							{timestamp}
						</span>
					</div>
					{isImage && (
						<a
							href={fileUrl}
							target='_blank'
							rel='noopener noreferrer'
							className='relative aspect-square rounded-md mt-2 overflow-hidden border flex
							items-center bg-secondary h-48 w-48'
						>
							<Image
								src={fileUrl}
								alt={content}
								fill
								className='object-cover'
							/>
						</a>
					)}
					{isPDFFile && (
						<div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
							<a
								href={fileUrl}
								target='_blank'
								rel='noopener noreferrer'
								className='ml-2 text-sm text-rose-500 dark:text-rose-400 hover:underline'
							>
								<div className='flex gap-x-2 items-center m-2'>
									<FileScan className='h-10 w-10 fill-rose-500 stroke-rose-400' />
									PDF file
								</div>
							</a>
						</div>
					)}
					{isTEXTFile && (
						<div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
							<FileText className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
							<a
								href={fileUrl}
								target='_blank'
								rel='noopener noreferrer'
								className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
							>
								TEXT file
							</a>
						</div>
					)}
					{!fileUrl && !isEditing && (
						<p
							className={cn(
								`
					text-sm text-zinc-600 dark:text-zinc-300`,
								deleted &&
									'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
							)}
						>
							{content}
							{isUpdated && !deleted && (
								<span className='text-[10px] mx-2 text-zinc-500 dark:text-zinc-400'>
									(edited)
								</span>
							)}
						</p>
					)}
					{!fileUrl && isEditing && (
						<Form {...form}>
							<form
								className='flex items-center w-full  gap-x-2 pt-2'
								onSubmit={form.handleSubmit(onSubmit)}
							>
								<FormField
									control={form.control}
									name='content'
									render={({ field }) => (
										<FormItem>
											<div className='relative w-[300px]'>
												<Input
													disabled={isLoading}
													className='p-2  bg-zinc-200/90 dark:bg-zinc-700/75 border-none
												border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600
												dark:text-zinc-200'
													placeholder='Edited mesage'
													{...field}
												/>
											</div>
										</FormItem>
									)}
								/>
								<Button disabled={isLoading} size='sm' variant='primary'>
									Save
									{isLoading && (
										<Loader2 className='text-white ml-2 transition duration-300 animate-spin h-4 w-4' />
									)}
								</Button>
							</form>
							<span className='text-[10px] mt-1 text-zinc-400'>
								Press escape to cancel,enter to save
							</span>
						</Form>
					)}
				</div>
			</div>
			{canDeleteMessage && (
				<div
					className='hidden group-hover:flex items-center gap-x-2 absolute
				p-1 top-2 right-10 bg-white dark:bg-zinc-800 border rounded-sm'
				>
					{canEditMessage && (
						<ActionTooltip label='Edit'>
							<Edit
								onClick={() => setIsEditing(true)}
								className='cursor-pointer ml-auto w-4 h-4 text-zinc-500
							hover:text-zinc-600 dark:hover:text-zinc-300 transition'
							/>
						</ActionTooltip>
					)}
					<ActionTooltip label='Delete'>
						<Trash
							className='cursor-pointer ml-auto w-4 h-4 text-zinc-500
							hover:text-zinc-600 dark:hover:text-zinc-300 transition'
						/>
					</ActionTooltip>
				</div>
			)}
		</div>
	)
}
