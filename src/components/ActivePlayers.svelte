<script lang="ts">
	import axios from 'axios'
	import { onMount } from 'svelte'

	import type { Score } from '../model/Types'

	import ScoreBoardEntry from './ScoreBoardEntry.svelte'
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
	const GET_SCORES_INTERVAL_IN_MS = +import.meta.env.VITE_GET_SCORES_INTERVAL_IN_MS

	let activeScores: Score[] = []

	const fetchActiveScores = async (): Promise<void> => {
		console.log('fetchActiveScores')
		const res = await axios.get(`${BACKEND_URL}/scores/activeScores`)
		activeScores = res.data.map(elem => ({
			username: elem.username,
			score: elem.score,
			scoreId: elem.id,
			snakeLength: elem.snakeLength,
		}))
	}

	onMount(async () => {
		setInterval(fetchActiveScores, GET_SCORES_INTERVAL_IN_MS)
	})
</script>

<div class="w-[172px] h-[336px] flex flex-col dark-gradient shadow-lg rounded mb-4 md:mb-0">
	<div class="flex flex-col font-extrabold text-xl p-3 items-center">
		<div>Active Players</div>
	</div>
	<div class="flex flex-col flex-wrap h-[300px] font-semibold text-sm items-center">
		{#each activeScores as activeScore, i}
			<ScoreBoardEntry no={activeScore} {i} activePlayers={true} />
		{/each}
	</div>
</div>
