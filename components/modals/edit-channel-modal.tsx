'use client'
import * as z from 'zod'

import axios from 'axios'

import qs from 'query-string'
import * as React from 'react'
import { useEffect } from 'react'

import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import { ChannelType } from '@prisma/client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: 'Channel name is required'
		})
		.refine(name => name !== 'general', {
			message: 'Channel name is not to be general'
		}),
	type: z.nativeEnum(ChannelType)
})
export const EditChannelModal = () => {
	const { isOpen, type, data, onClose } = useModal()
	const isModalOpen: boolean = isOpen && type === 'editChannel'
	const router = useRouter()
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { name: '', type: data.channel?.type || ChannelType.TEXT }
	})
	const isLoading = form.formState.isSubmitting
	const handleClose = () => {
		form.reset()
		onClose()
	}
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: `/api/channels/${data.channel?.id}`,
				query: { serverId: data.server?.id }
			})
			await axios.patch(url, values)
			handleClose()
			router.refresh()
		} catch (err) {
			console.log(err)
		}
	}
	useEffect(() => {
		if (data.channel) {
			form.setValue('name', data.channel.name)
			form.setValue('type', data.channel.type)
		}
	}, [form, data.channel])
	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className='bg-white text-black p-0 overflow-hidden'>
				<DialogHeader className='pt-8 px-6'>
					<DialogTitle className='text-2xl text-center font-bold'>
						Edit your channel
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className='spacey-y-8' onSubmit={form.handleSubmit(onSubmit)}>
						<div className='space-y-8 px-6'>
							<FormField
								name='name'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
											Channel name
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black
												focus-visible:ring-offset-0
												'
												placeholder='Enter channel name'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name='type'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Channel Type</FormLabel>
										<Select
											disabled={isLoading}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger
													className='bg-zinc-300/500 border-0
												focus:ring-0 text-black ring-offset-0 focus:ring-offset-0
												 capitalize outline-none'
												>
													<SelectValue placeholder='Select a channel type' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(ChannelType).map(type => (
													<SelectItem
														value={type}
														key={type}
														className='capitalize'
													>
														{type.toLowerCase()}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className='bg-gray-100 px-6 py-4'>
							<Button variant='primary' disabled={isLoading}>
								Save
								{isLoading && (
									<Loader2 className='text-white ml-2 transition duration-300 animate-spin h-4 w-4' />
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
