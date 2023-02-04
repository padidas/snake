import { PrismaClient, type score } from '@prisma/client'
export const prisma = new PrismaClient()

export async function getTop10Players(): Promise<score[]> {
	await prisma.$connect()

	return await prisma.score.findMany({ take: 10 })
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
