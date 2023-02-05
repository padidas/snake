<script lang="ts">
	import { fetchActiveScores, activeScores, currentScoreId } from '../stores/ScoreStore'
	import { privateMode } from '../stores'
	import { onMount } from 'svelte'
	import ScoreBoardEntry from './ScoreBoardEntry.svelte'
	import { FETCH_ACTIVE_SCORES_INTERVAL } from '../model/Constants'

	onMount(async () => {
		privateMode.set(JSON.parse(window.localStorage.storedPrivateMode ?? false))
		privateMode.subscribe(pm => (window.localStorage.storedPrivateMode = pm))
		setInterval(fetchActiveScores, FETCH_ACTIVE_SCORES_INTERVAL)
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
			{#each $activeScores as activeScore, i}
				<ScoreBoardEntry
					score={activeScore}
					{i}
					activePlayers={true}
					currentScoreId={$currentScoreId}
				/>
			{/each}
		{/if}
	</div>
</div>
<div class="h-[40px]" />
