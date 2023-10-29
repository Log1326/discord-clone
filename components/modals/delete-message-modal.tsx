'use client'
import * as React from 'react'
import { useState } from 'react'
import { useModal } from '@/hooks/use-modal-store'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import qs from 'query-string'

export const DeleteMessageModal = () => {
	const [isLoading, setIsLoading] = useState(false)
	const { isOpen, type, data, onClose } = useModal()
	const isModalOpen: boolean = isOpen && type === 'deleteMessage'
	const onClick = async () => {
		try {
			setIsLoading(true)
			const url = qs.stringifyUrl({
				url: data.apiUrl || '',
				query: data.query
			})
			await axios.delete(url)
			onClose()
		} catch (err) {
			console.log(err)
		} finally {
			setIsLoading(false)
		}
	}
	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className='bg-white text-black p-0 overflow-hidden'>
				<DialogHeader className='pt-8 px-6'>
					<DialogTitle className='text-2xl text-center font-bold'>
						Delete Message
					</DialogTitle>
					<DialogDescription className='text-center text-zinc-500'>
						Are you sure you want to delete?
						<br />
						This message will be deleted!
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className='bg-gray-100 px-6 py-4'>
					<div className='flex items-center justify-between w-full'>
						<Button disabled={isLoading} onClick={onClose} variant='ghost'>
							Cancel
						</Button>
						<Button disabled={isLoading} onClick={onClick} variant='primary'>
							Confirm
							{isLoading && (
								<Loader2 className='text-white ml-2 transition duration-300 animate-spin h-4 w-4' />
							)}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
