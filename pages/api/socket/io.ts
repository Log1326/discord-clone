import { NextApiResponse } from 'next'
import { Server as ServerIo } from 'socket.io'
import { Server as ServerHttp } from 'http'
import { NextApiResponseServerIo } from '@/types'

export const config = { api: { bodyParser: false } }
const ioHandler = (req: NextApiResponse, res: NextApiResponseServerIo) => {
	if (!res.socket.server.io) {
		const path = `/api/socket/io`
		const httpServer: ServerHttp = res.socket.server as any
		res.socket.server.io = new ServerIo(httpServer, {
			path,
			addTrailingSlash: false
		})
	}
	return res.end()
}
export default ioHandler
