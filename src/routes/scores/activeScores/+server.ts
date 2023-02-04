import { json } from '@sveltejs/kit'
import type { Score } from '../../../model/Types'

// GET activePlayers
export async function GET(): Promise<Response> {
	const activePlayers: Score[] = [
		{ scoreId: 'asdjie', username: 'padidas', score: 206, snakeLength: 43, privateMode: false },
		{ scoreId: 'ijwed3', username: 'Nele', score: 299, snakeLength: 54, privateMode: false },
		{ scoreId: 'i923ra', username: 'Schmerlock', score: 230, snakeLength: 49, privateMode: false },
	]

	return json(activePlayers)
}

// POST current score
// export function POST(): Promise<Response> {

// }

// @PostMapping
// fun createOrUpdateScore(@RequestBody scoreReq: ScoreReq): ResponseEntity<Score> {
//     println("POST /scores ********************************")
//     val username = if (scoreReq.username.trim().isEmpty()) "Anonymous" else scoreReq.username.trim()

//     val stillEncodedAndCombinedScore = String(Base64.getDecoder().decode(scoreReq.score))
//     val stillEncodedScore = scoreConfig.iso?.let { stillEncodedAndCombinedScore.split(it) }?.get(1)
//     val decodedScore = String(Base64.getDecoder().decode(stillEncodedScore))

//     val score = Score(
//         id = scoreReq.scoreId,
//         score = decodedScore.toInt(),
//         username = username,
//         normalizedUsername = username.lowercase(),
//         snakeLength = scoreReq.snakeLength,
//         modifiedDate = LocalDateTime.now(),
//         privateMode = scoreReq.privateMode,
//     )
//     return ResponseEntity.ok(scoreMongoRepo.save(score))
// }
