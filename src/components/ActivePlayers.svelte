<script lang="ts">
	import ScoreBubble from './ScoreBubble.svelte'

	export let activeScores = []
</script>

<div class="w-[172px] h-[336px] flex flex-col dark-gradient shadow-lg rounded mb-4 md:mb-0">
	<div class="flex flex-col font-extrabold text-xl p-3 items-center">
		<div>Active Players</div>
	</div>
	<div class="flex flex-col flex-wrap h-[300px] font-semibold text-sm items-center">
		{#each activeScores as activeScore}
			<div class="flex m-1 justify-between w-11/12">
				<div>
					{activeScore.username}
				</div>
				<ScoreBubble score={activeScore.score} />
			</div>
		{/each}
	</div>
</div>
