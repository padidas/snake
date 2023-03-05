import { username, privateMode } from '../stores'
import { writable, get } from 'svelte/store'
import type { Score } from '../model/Types'
import ObjectID from 'bson-objectid'
import { Buffer } from 'buffer'

const TIMESTAMP_FORMATTER_ISO = import.meta.env.VITE_TIMESTAMP_FORMATTER_ISO

export const activeScores = writable<Score[]>([])
export const topScores = writable<Score[]>([])
export const topPlayers = writable<Score[]>([])
export const currentScore = writable<number>(0)
export const currentScoreId = writable<string>(ObjectID().toHexString())
export const snakeLength = writable<number>(0)

export const incrementCurrentScore = () => currentScore.update(cs => cs + 1)
export const resetCurrentScore = () => currentScore.set(0)
export const resetCurrentScoreId = () => currentScoreId.set(ObjectID().toHexString())

export async function fetchTopPlayers() {
	console.log('fetchTopPlayers')
	const res = await fetch(`/scores/topPlayers`)
	const data = await res.json()
	topPlayers.set(
		data.map(elem => ({
			scoreId: elem.id,
			username: elem.username,
			score: elem.score,
			snakeLength: elem.snakeLength,
		})),
	)
}

export async function fetchActiveScores() {
	console.log('fetchActiveScores')
	const res = await fetch(`scores/activeScores`)
	const data = await res.json()
	activeScores.set(
		data.map(elem => ({
			scoreId: elem.id,
			username: elem.username,
			score: elem.score,
			snakeLength: elem.snakeLength,
			privateMode: elem.privateMode ?? false,
		})),
	)
}

export async function postCurrentScore() {
	console.log('SAVE NEW SCORE')

	const combined =
		'' +
		Buffer.from('' + TIMESTAMP_FORMATTER_ISO).toString('base64') + // hshehashe -> xxyxxyxy
		Buffer.from('' + get(currentScore)).toString('base64') // 4 -> zjjzjzzzj

	const score = Buffer.from(combined).toString('base64') // xxyxxyxyzjjzjzzzj -> blbababslab

	const composedScore = {
		scoreId: get(currentScoreId),
		username: get(username),
		score: score,
		snakeLength: get(snakeLength),
		privateMode: get(privateMode),
	}

	await fetch(`scores/activeScores`, {
		method: 'POST',
		body: JSON.stringify(composedScore),
		headers: {
			'content-type': 'application/json',
		},
	})
	fetchTopPlayers()
}
