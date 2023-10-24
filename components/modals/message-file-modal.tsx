'use client'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as React from 'react'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useModal } from '@/hooks/use-modal-store'
import qs from 'query-string'
import axios from 'axios'

const formSchema = z.object({
	fileUrl: z.string().min(1, {
		message: 'Attachment is required'
	})
})
export const MessageFileModal = () => {
	const { isOpen, onClose, type, data } = useModal()
	const isModalOpen = isOpen && type === 'messageFile'
	const router = useRouter()
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { fileUrl: '' }
	})
	const isLoading = form.formState.isSubmitting
	const handleClose = () => {
		form.reset()
		onClose()
	}
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: data.apiUrl || '',
				query: data.query
			})
			await axios.post(url, { ...values, content: values.fileUrl })
			handleClose()
			router.refresh()
			window.location.reload()
		} catch (err) {
			console.log(err)
		}
	}
	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className='bg-white text-black p-0 overflow-hidden'>
				<DialogHeader className='pt-8 px-6'>
					<DialogTitle className='text-2xl text-center font-bold'>
						Add an attachment
					</DialogTitle>
					<DialogDescription className='text-center text-zinc-500'>
						Send file as a message
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form className='spacey-y-8' onSubmit={form.handleSubmit(onSubmit)}>
						<div className='space-y-8 px-6'>
							<div className='grid place-content-center'>
								<FormField
									name='fileUrl'
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint='messageFile'
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter className='bg-gray-100 px-6 py-4'>
							<Button
								variant='primary'
								className='transition-all duration-300'
								disabled={isLoading}
							>
								{isLoading ? 'booting...' : 'Send'}
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
