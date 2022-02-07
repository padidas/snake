import type { Square } from 'src/model/Types'
import { derived, writable } from 'svelte/store'

export const INITIAL_SNAKE_BODY: Square[] = [[4, 2]]

export const snakeBody = writable(INITIAL_SNAKE_BODY)
