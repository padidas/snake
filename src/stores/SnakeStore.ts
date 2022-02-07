import type { Square } from 'src/model/Types'
import { derived, writable } from 'svelte/store'

export const INITIAL_SNAKE_HEAD: Square = [4, 3]
export const INITIAL_SNAKE_BODY: Square[] = [[4, 2]]

export const snakeHead = writable(INITIAL_SNAKE_HEAD)
export const snakeBody = writable(INITIAL_SNAKE_BODY)

export const lastSnakeBodyPart = derived(snakeBody, $snakeBody => $snakeBody[$snakeBody.length - 1])
export const snakeBodyWithoutFirst = derived(snakeBody, $snakeBody =>
	$snakeBody.filter((_, i) => i !== 0),
)
