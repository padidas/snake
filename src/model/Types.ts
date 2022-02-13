// types
export type Square = [number, number]
export type Direction = 'up' | 'down' | 'left' | 'right'
export type Score = {
	scoreId?: string
	username: string
	score: number
	snakeLength: number
	privateMode?: boolean
}
export type HeadRotation = '0deg' | '90deg' | '180deg' | '270deg'
