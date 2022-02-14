import { username, privateMode } from '../stores'
import { writable, get } from 'svelte/store'
import axios from 'axios'
import type { Score } from 'src/model/Types'
import ObjectID from 'bson-objectid'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const activeScores = writable<Score[]>([])
export const topScores = writable<Score[]>([])
export const currentScore = writable<number>(0)
export const currentScoreId = writable<string>(ObjectID().toHexString())

export const incrementCurrentScore = (): void => currentScore.update(cs => cs + 1)
export const resetCurrentScore = (): void => currentScore.set(0)
export const resetCurrentScoreId = (): void => currentScoreId.set(ObjectID().toHexString())

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

export const postCurrentScore = async (snakeLength: number): Promise<void> => {
	console.log('SAVE NEW SCORE')
	const composedScore: Score = {
		scoreId: get(currentScoreId),
		username: get(username),
		score: get(currentScore),
		snakeLength: snakeLength,
		privateMode: get(privateMode),
	}
	await axios.post(`${BACKEND_URL}/scores`, composedScore)
	fetchTopScores()
}
