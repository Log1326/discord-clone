'use client'
import { UploadDropzone } from '@/lib/uploadthing'
import '@uploadthing/react/styles.css'
import Image from 'next/image'
import { X } from 'lucide-react'

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
	return (
		<UploadDropzone
			onClientUploadComplete={res => onChange(res?.[0].url)}
			onUploadError={(error: Error) => console.log(error)}
			endpoint={endpoint}
		/>
	)
}
