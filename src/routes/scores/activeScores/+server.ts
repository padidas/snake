import type { score } from '@prisma/client'
import { json } from '@sveltejs/kit'
import { createOrUpdateScore, getActivePlayers } from 'src/lib/database'

// CONTROLLER - GET - active players
export async function GET(): Promise<Response> {
	const activePlayers = await getActivePlayers()

	return json(activePlayers)
}

// CONTROLLER - POST - new active Score
export async function POST({ request }): Promise<Response> {
	const newScore = await request.json()

	const username = newScore.username.trim() ? newScore.username.trim() : 'Anonymous'

	const dbScore: score = {
		id: newScore.scoreId,
		score: newScore.score,
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
