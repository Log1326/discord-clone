import { db } from './db'

export async function getOrCreateConversation(
	memberOneId: string,
	memberTwoId: string
) {
	let conversation =
		(await findConversation(memberOneId, memberTwoId)) ||
		(await createNewConversation(memberOneId, memberTwoId))
	if (!conversation)
		conversation = await createNewConversation(memberOneId, memberTwoId)
	return conversation
}
async function findConversation(memberOneId: string, memberTwoId: string) {
	try {
		return db.conversation.findFirst({
			where: { AND: [{ memberOneId }, { memberTwoId }] },
			include: {
				memberOne: { include: { profile: true } },
				memberTwo: { include: { profile: true } }
			}
		})
	} catch (err) {
		console.log(err, 'FIND_CONVERSATION')
		return null
	}
}
async function createNewConversation(memberOneId: string, memberTwoId: string) {
	try {
		return db.conversation.create({
			data: { memberOneId, memberTwoId },
			include: {
				memberOne: { include: { profile: true } },
				memberTwo: { include: { profile: true } }
			}
		})
	} catch (err) {
		console.log('CREATE_CONVERSATION')
		return null
	}
}
