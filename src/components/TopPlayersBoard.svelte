<script lang="ts">
	import { topPlayers, fetchTopPlayers } from '../stores/ScoreStore'
	import { username } from '../stores'
	import ScoreBoardEntry from './ScoreBoardEntry.svelte'
	import { onMount } from 'svelte'
	import { FETCH_TOP_SCORES_INTERVAL } from '../model/Constants'

	onMount(async () => {
		fetchTopPlayers()
		setInterval(fetchTopPlayers, FETCH_TOP_SCORES_INTERVAL)
	})
</script>

<div class="w-[344px] h-[336px] flex flex-col dark-gradient shadow-lg rounded mb-4 md:mb-0">
	<div class="flex flex-col font-extrabold text-xl p-3 items-center">
		<div>Top 10 Players</div>
	</div>
	<div class="flex flex-col flex-wrap h-[300px] items-center">
		{#each $topPlayers as score, i}
			<ScoreBoardEntry {score} {i} currentScoreId={$username} />
		{/each}
	</div>
</div>
