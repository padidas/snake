import { PrismaClient } from '@prisma/client'
import type { Score } from 'src/model/Types'
export const prisma = new PrismaClient()

export async function getTop10Players(): Promise<Score[]> {
	await prisma.$connect()

	const highestScoresInfo = await prisma.score.groupBy({
		by: ['normalizedUsername'],
		where: {
			score: {
				gte: 23,
			},
		},
		_max: {
			score: true,
		},
		orderBy: {
			_max: {
				score: 'desc',
			},
		},
		take: 10,
	})

	const highestScores = await Promise.all(
		highestScoresInfo.map(async scoreInfo => {
			const highestIndividualScore = await prisma.score.findFirst({
				where: {
					normalizedUsername: scoreInfo.normalizedUsername,
					score: scoreInfo._max.score,
				},
			})

			return {
				username: highestIndividualScore.username,
				score: highestIndividualScore.score,
				snakeLength: highestIndividualScore.snakeLength,
			} as Score
		}),
	)

	return highestScores
}
