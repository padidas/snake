import { PrismaClient, type score } from '@prisma/client'
import type { Score } from 'src/model/Types'
export const prisma = new PrismaClient()

export async function getTop10Players(): Promise<Score[]> {
	await prisma.$connect()

	const x = await prisma.score.groupBy({
		by: ['normalizedUsername'],
		where: {
			score: {
				gte: 150,
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

	const djd = x.map((elem, i) => {
		const a: Score = {
			privateMode: false,
			score: elem._max.score,
			scoreId: '' + i,
			snakeLength: 2,
			username: elem.normalizedUsername,
		}

		return a
	})

	console.log(djd)
	return djd

	// return await prisma.score.findMany({ take: 10 })

	// const myScores = await prisma.score.aggregate({
	// 	where: {
	// 		normalizedUsername: {
	// 			equals: 'padidas',
	// 		},
	// 	},
	// 	orderBy: {
	// 		score: 'desc',
	// 	},
	// 	take: 10,
	// })

	// const scroy = myScores.map(score => ({
	// 	score: score.score,
	// 	privateMode: score.privateMode,
	// 	username: score.username,
	// 	scoreId: score.id,
	// 	snakeLength: score.snakeLength,
	// }))

	// return scroy
}

// val aggregation = newAggregation(
// 	sort(Sort.Direction.DESC, "score"),
// 	group("normalizedUsername")
// 			.first("username").`as`("username")
// 			.first("normalizedUsername").`as`("normalizedUsername")
// 			.first("score").`as`("score")
// 			.first("snakeLength").`as`("snakeLength")
// 			.first("modifiedDate").`as`("modifiedDate"),
// 	sort(Sort.Direction.DESC, "score"),
// 	limit(10)
// )
