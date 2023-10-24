'use client'
import { UploadDropzone } from '@/lib/uploadthing'
import '@uploadthing/react/styles.css'
import Image from 'next/image'
import { FileScan, FileText, X } from 'lucide-react'

type EndpointType = 'serverImage' | 'messageFile'
interface fileUploadProps {
	endpoint: EndpointType
	value: string
	onChange: (url?: string) => void
}
export const FileUpload: React.FC<fileUploadProps> = props => {
	const { value, onChange, endpoint = 'serverImage' } = props
	const fileType = value?.split('.').pop()
	if (value && fileType !== 'pdf' && fileType !== 'text') {
		return (
			<div className='relative h-20 w-20'>
				<Image src={value} alt='upload' fill className='rounded-full' />
				<button
					onClick={() => onChange('')}
					className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-md'
					type='button'
				>
					<X className='h-4 w-4' />
				</button>
			</div>
		)
	}
	if (value && fileType === 'pdf')
		return (
			<div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
				<a
					href={value}
					target='_blank'
					rel='noopener noreferrer'
					className='ml-2 text-sm text-rose-500 dark:text-rose-400 hover:underline'
				>
					<div className='flex gap-x-2 items-center m-2'>
						<FileScan className='h-10 w-10 fill-rose-500 stroke-rose-400' />
						{value}
					</div>
				</a>
				<button
					onClick={() => onChange('')}
					className='bg-neutral-800 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-md'
					type='button'
				>
					<X className='h-4 w-4' />
				</button>
			</div>
		)
	if (value && fileType === 'text')
		return (
			<div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
				<FileText className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
				<a
					href={value}
					target='_blank'
					rel='noopener noreferrer'
					className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
				>
					{value}
				</a>
				<button
					onClick={() => onChange('')}
					className='bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-md'
					type='button'
				>
					<X className='h-4 w-4' />
				</button>
			</div>
		)
	return (
		<UploadDropzone
			onClientUploadComplete={res => onChange(res?.[0].url)}
			onUploadError={(error: Error) => console.log(error)}
			endpoint={endpoint}
		/>
	)
}
