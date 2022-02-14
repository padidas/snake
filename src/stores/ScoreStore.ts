import axios from 'axios'
import type { Score } from 'src/model/Types'
import { writable } from 'svelte/store'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const activeScores = writable<Score[]>([])
export const topScores = writable<Score[]>([])

export const fetchTopScores = async (): Promise<void> => {
	console.log('fetchTopScores')
	const res = await axios.get(`${BACKEND_URL}/scores/topScores`)
	topScores.set(
		res.data.map(elem => ({
			scoreId: elem.id,
			username: elem.username,
			score: elem.score,
			snakeLength: elem.snakeLength,
		})),
	)
}

export const fetchActiveScores = async (): Promise<void> => {
	console.log('fetchActiveScores')
	const res = await axios.get(`${BACKEND_URL}/scores/activeScores`)
	activeScores.set(
		res.data.map(elem => ({
			scoreId: elem.id,
			username: elem.username,
			score: elem.score,
			snakeLength: elem.snakeLength,
			privateMode: elem.privateMode ?? false,
		})),
	)
}

export const postCurrentScore = async (currentScore: Score): Promise<void> => {
	console.log('SAVE NEW SCORE')
	await axios.post(`${BACKEND_URL}/scores`, currentScore)
	fetchTopScores()
}
