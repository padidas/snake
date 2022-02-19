import type { Square } from '../model/Types'
import { get, writable } from 'svelte/store'
import { SQUARES_MAX } from 'src/model/Constants'

export const fruitIcons = ['/assets/apple.svg', '/assets/banana.svg', '/assets/avocado.svg']
const INITIAL_FOOD_POSITION: Square = [8, 6]

export const food = writable<Square>(INITIAL_FOOD_POSITION)
export const appleOrBanana = writable<number>(0)

export const resetFood = (snakeBody: Square[]): void => {
	determineFruitIcon()
	do {
		food.set([Math.floor(Math.random() * SQUARES_MAX), Math.floor(Math.random() * SQUARES_MAX)])
	} while (snakeBody.some(elem => elem[0] === get(food)[0] && elem[1] === get(food)[1]))
}

const determineFruitIcon = () => appleOrBanana.set(Math.floor(Math.random() * fruitIcons.length))
