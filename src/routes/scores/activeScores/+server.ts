import type { score } from '@prisma/client'
import { json } from '@sveltejs/kit'
import { createOrUpdateScore, getActivePlayers } from 'src/lib/database'
import type { RequestEvent } from './$types'
const TIMESTAMP_FORMATTER_ISO = import.meta.env.VITE_TIMESTAMP_FORMATTER_ISO

// CONTROLLER - GET - active players
export async function GET(): Promise<Response> {
	const activePlayers = await getActivePlayers()

	return json(activePlayers)
}

// CONTROLLER - POST - new active Score
export async function POST({ request }: RequestEvent): Promise<Response> {
	const newScore = await request.json()

	const username = newScore.username.trim() ? newScore.username.trim() : 'Anonymous'
	const stillEncodedAndCombinedScore = Buffer.from(newScore.score, 'base64').toString('ascii')
	const encodedTimestamp = Buffer.from('' + TIMESTAMP_FORMATTER_ISO).toString('base64')
	const stillEncodedScore = stillEncodedAndCombinedScore.split(encodedTimestamp)
	const decodedScore = Buffer.from(stillEncodedScore[1], 'base64').toString('ascii')

	const dbScore: score = {
		id: newScore.scoreId,
		score: Number(decodedScore),
		snakeLength: newScore.snakeLength,
		username: username,
		normalizedUsername: username.toLowerCase(),
		privateMode: newScore.privateMode,
		modifiedDate: new Date(),
		class: 'Score',
	}

	await createOrUpdateScore(dbScore)
	return new Response()
}
