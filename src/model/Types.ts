// types
export type Square = [number, number]
export type Direction = 'up' | 'down' | 'left' | 'right'
export type Score = {
	username: string
	score: number
	scoreId?: string
	snakeLength: number
}
export type HeadRotation = '0deg' | '90deg' | '180deg' | '270deg'
