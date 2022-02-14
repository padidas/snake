<script lang="ts">
	import ScoreBoardEntry from './ScoreBoardEntry.svelte'
	import { topScores, fetchTopScores, currentScoreId } from '../stores/ScoreStore'
	import { onMount } from 'svelte'
	const GET_SCORES_INTERVAL_IN_MS = +import.meta.env.VITE_GET_SCORES_INTERVAL_IN_MS

	onMount(async () => {
		fetchTopScores()
		setInterval(fetchTopScores, GET_SCORES_INTERVAL_IN_MS)
	})
</script>

<div class="w-[344px] h-[336px] flex flex-col dark-gradient shadow-lg rounded mb-4 md:mb-0">
	<div class="flex flex-col font-extrabold text-xl p-3 items-center">
		<div>Top 10</div>
	</div>
	<div class="flex flex-col flex-wrap h-[300px] items-center">
		{#each $topScores as no, i}
			<ScoreBoardEntry {no} {i} currentScoreId={$currentScoreId} />
		{/each}
	</div>
</div>
