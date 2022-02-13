<script lang="ts">
	import { onMount } from 'svelte'
	import type { Score } from '../model/Types'
	import ScoreBoardEntry from './ScoreBoardEntry.svelte'
	import axios from 'axios'
	import { privateMode } from '../stores'

	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
	const GET_SCORES_INTERVAL_IN_MS = +import.meta.env.VITE_GET_SCORES_INTERVAL_IN_MS

	let activeScores: Score[] = []

	onMount(() => {
		privateMode.set(JSON.parse(window.localStorage.storedPrivateMode) ?? false)
		privateMode.subscribe(pm => (window.localStorage.storedPrivateMode = pm))
	})

	const fetchActiveScores = async (): Promise<void> => {
		console.log('fetchActiveScores')
		const res = await axios.get(`${BACKEND_URL}/scores/activeScores`)
		activeScores = res.data.map(elem => ({
			scoreId: elem.id,
			username: elem.username,
			score: elem.score,
			snakeLength: elem.snakeLength,
			privateMode: elem.privateMode ?? false,
		}))
	}

	onMount(async () => {
		setInterval(fetchActiveScores, GET_SCORES_INTERVAL_IN_MS)
	})
</script>

<div class="flex h-[40px] justify-center text-sm font-semibold items-center">
	<input type="checkbox" id="showAsActive" bind:checked={$privateMode} class="h-4 w-4 mr-1" />
	<label class="text-xs font-bold" for="showAsActive"> PRIVATE MODE </label>
</div>
<div class="w-[172px] h-[336px] flex flex-col dark-gradient shadow-lg rounded mb-4 md:mb-0">
	<div class="flex flex-col font-extrabold text-xl p-3 items-center">
		<div>Active Players</div>
	</div>
	<div class="flex flex-col flex-wrap h-[300px] font-semibold text-sm items-center">
		{#if $privateMode}
			<div class="text-gray-400 text-center p-2">
				Deactivate private&nbsp;mode to see if someone else is playing.
			</div>
		{:else}
			{#each activeScores as activeScore, i}
				<ScoreBoardEntry no={activeScore} {i} activePlayers={true} />
			{/each}
		{/if}
	</div>
</div>
<div class="h-[40px]" />
