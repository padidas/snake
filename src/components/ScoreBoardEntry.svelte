<script lang="ts">
	import type { Score } from '../model/Types'
	import ScoreBubble from './ScoreBubble.svelte'

	export let score: Score
	export let i: number
	export let currentScoreId: string | undefined = ''
	export let activePlayers: boolean | undefined = false
</script>

<div
	class="relative flex w-[156px] h-11 font-semibold justify-between flex-nowrap text-sm items-center rounded-md bg-white mb-3 px-2 shadow-md"
	class:dark-gradient-highlighted={currentScoreId === score.scoreId}
	title="🐍 {score.username} &#013;🏆 {score.score} (score) &#013;📏 {score.snakeLength} (length)"
>
	{#if i === 0 && !activePlayers}
		<img src="/assets/crown.png" alt="a crown" class="absolute -top-3 -left-3 -rotate-12 h-8" />
	{/if}
	<div class="flex flex-1 min-w-0">
		{#if !activePlayers}
			<div class="mr-1">
				{i + 1 + '.'}
			</div>
		{/if}
		<p class="text-ellipsis overflow-hidden whitespace-nowrap z-10 font-bold">
			{score.username}
		</p>
	</div>
	<ScoreBubble score={score.score} />
</div>
