'use client'
import * as z from 'zod'
import axios from 'axios'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useModal } from '@/hooks/use-modal-store'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload'

import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import * as React from 'react'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
	name: z.string().min(1, {
		message: 'Server name is required'
	}),
	imageUrl: z.string().min(1, {
		message: 'Server imageUrl is required'
	})
})
export const EditServerModal = () => {
	const {
		isOpen,
		type,
		data: { server },
		onClose
	} = useModal()
	const isModalOpen: boolean = isOpen && type === 'editServer'
	const router = useRouter()
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { name: '', imageUrl: '' }
	})
	const isLoading = form.formState.isSubmitting
	const handleClose = () => {
		form.reset()
		onClose()
	}
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/servers/${server?.id}`, values)
			handleClose()
			router.refresh()
		} catch (err) {
			console.log(err)
		}
	}
	useEffect(() => {
		if (server) {
			form.setValue('name', server.name)
			form.setValue('imageUrl', server.imageUrl)
		}
	}, [form, server])
	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className='bg-white text-black p-0 overflow-hidden'>
				<DialogHeader className='pt-8 px-6'>
					<DialogTitle className='text-2xl text-center font-bold'>
						Editing your server
					</DialogTitle>
					<DialogDescription className='text-center text-zinc-500'>
						Change your server name and an image
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form className='spacey-y-8' onSubmit={form.handleSubmit(onSubmit)}>
						<div className='space-y-8 px-6'>
							<div className='grid place-content-center'>
								<FormField
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint='serverImage'
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
									name='imageUrl'
								/>
							</div>
							<FormField
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
											Server name
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black
												focus-visible:ring-offset-0
												'
												placeholder='Enter server name'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
								name='name'
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
