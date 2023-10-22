'use client'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as React from 'react'
import { useEffect, useState } from 'react'

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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import axios from 'axios'

const formSchema = z.object({
	name: z.string().min(1, {
		message: 'Server name is required'
	}),
	imageUrl: z.string()
})
export const InitialModal = () => {
	const [isMounted, setIsMounted] = useState(false)
	const [isShow, setIsShow] = useState(false)
	const router = useRouter()
	useEffect(() => {
		setIsMounted(true)
	}, [])
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { name: '', imageUrl: '' }
	})
	const isLoading = form.formState.isSubmitting
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			if (isShow) return router.push(values.name)
			await axios.post('/api/servers', values)
			form.reset()
			router.refresh()
			window.location.reload()
		} catch (err) {
			console.log(err)
		}
	}
	if (!isMounted) return null
	return (
		<Dialog open>
			<DialogContent className='bg-white text-black p-0 overflow-hidden'>
				<DialogHeader className='pt-8 px-6'>
					<DialogTitle className='text-2xl text-center font-bold'>
						Customize your server
					</DialogTitle>
					<DialogDescription className='text-center text-zinc-500'>
						Give your server a personality with a name and an image. You can{' '}
						always change it later
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form className='spacey-y-8' onSubmit={form.handleSubmit(onSubmit)}>
						<div className='space-y-8 px-6'>
							<div className='grid place-content-center'>
								<FormField
									name='imageUrl'
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
								/>
							</div>
							<FormField
								name='name'
								control={form.control}
								render={({ field }) => (
									<>
										{isShow ? (
											<FormItem>
												<FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
													Put your link
												</FormLabel>
												<FormControl>
													<Input
														type='url'
														disabled={isLoading}
														className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black
												focus-visible:ring-offset-0
												'
														placeholder='link...'
														{...field}
													/>
												</FormControl>
											</FormItem>
										) : (
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
									</>
								)}
							/>
						</div>
						<DialogFooter className='bg-gray-100 px-6 py-4'>
							<div className='flex items-center justify-between w-full'>
								{isShow ? (
									<>
										<Button
											variant='ghost'
											onClick={() => setIsShow(false)}
											disabled={isLoading}
										>
											Back
										</Button>

										<Button variant='primary' disabled={isLoading}>
											Connect
											{isLoading && (
												<Loader2 className='text-white ml-2 transition duration-300 animate-spin h-4 w-4' />
											)}
										</Button>
									</>
								) : (
									<>
										<Button
											onClick={event => {
												event.preventDefault()
												setIsShow(true)
											}}
											variant='ghost'
											disabled={isLoading}
										>
											Join with link
										</Button>
										<Button variant='primary' disabled={isLoading}>
											Create
											{isLoading && (
												<Loader2 className='text-white ml-2 transition duration-300 animate-spin h-4 w-4' />
											)}
										</Button>
									</>
								)}
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
