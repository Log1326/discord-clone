'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

type SocketContextType = {
	socket: Socket | null
	isConnected: boolean
}
interface SocketProviderProps {
	children: React.ReactNode
}
const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false
})
export const useSocket = () => useContext(SocketContext)

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null)
	const [isConnected, setIsConnected] = useState(false)
	useEffect(() => {
		const path = process.env.NEXT_PUBLIC_SITE_URL as string
		const socketInstance = io(path, {
			path: '/api/socket/io',
			addTrailingSlash: false
		})
		socketInstance.on('connect', () => setIsConnected(true))
		socketInstance.on('disconnect', () => setIsConnected(false))
		setSocket(socketInstance)
		return () => {
			socketInstance.disconnect()
		}
	}, [])
	return (
		<SocketContext.Provider value={{ socket, isConnected }}>
			{children}
		</SocketContext.Provider>
	)
}
