<script lang="ts">
	import type { Score } from '../model/Types'
	import ScoreBubble from './ScoreBubble.svelte'

	export let no: Score
	export let i: number
	export let currentScoreId: string = ''
	export let activePlayers: boolean = false
</script>

<div
	class="relative flex w-[156px] h-11 font-semibold justify-between flex-nowrap text-sm items-center rounded-md bg-white mb-3 px-2 shadow-md"
	class:dark-gradient-highlighted={currentScoreId === no.scoreId}
	title="🐍 {no.username} &#013;🏆 {no.score} (score) &#013;📏 {no.snakeLength} (length)"
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
			{no.username}
		</p>
	</div>
	<ScoreBubble score={no.score} />
</div>
