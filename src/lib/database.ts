import { PrismaClient, type score } from '@prisma/client'
import type { Score } from 'src/model/Types'
export const prisma = new PrismaClient()

export async function getTop10Players(): Promise<Score[]> {
	await prisma.$connect()

	const highestScoresInfo = await prisma.score.groupBy({
		by: ['normalizedUsername'],
		where: {
			score: {
				gte: 50,
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

export async function getActivePlayers(): Promise<Score[]> {
	await prisma.$connect()

	const time10SecondsAgo = subtract10SecondsFromDate(new Date())

	const activePlayers = await prisma.score.findMany({
		where: {
			modifiedDate: {
				gte: time10SecondsAgo,
			},
			privateMode: false,
		},
		take: 8,
		orderBy: {
			modifiedDate: 'desc',
		},
	})

	return activePlayers.map(
		score =>
			({
				username: score.username,
				score: score.score,
				snakeLength: score.snakeLength,
			} as Score),
	)
}

export async function createOrUpdateScore(score: score): Promise<score> {
	await prisma.$connect()

	return await prisma.score.upsert({
		where: {
			id: score.id,
		},
		update: {
			score: score.score,
			snakeLength: score.snakeLength,
			privateMode: score.privateMode,
			modifiedDate: score.modifiedDate,
		},
		create: {
			id: score.id,
			username: score.username,
			normalizedUsername: score.normalizedUsername,
			score: score.score,
			snakeLength: score.snakeLength,
			privateMode: score.privateMode,
			modifiedDate: score.modifiedDate,
			class: score.class,
		},
	})
}

function subtract10SecondsFromDate(timeNow: Date): Date {
	timeNow.setSeconds(timeNow.getSeconds() - 10)
	return timeNow
}
