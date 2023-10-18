import { auth, redirectToSignIn } from '@clerk/nextjs'
import { db } from '@/lib/db'

export const currentProfile = async () => {
	const { userId } = auth()
	if (!userId) return null
	const profile = await db.profile.findUnique({
		where: { userId }
	})
	if (!profile) return redirectToSignIn()
	return profile
}
