<script lang="ts">
	import type { Score } from '../model/Types'
	import ScoreBubble from './ScoreBubble.svelte'

	export let no: Score
	export let i: number
	export let currentScoreId: string = ''
</script>

<div
	class="relative flex w-[156px] h-11 font-semibold justify-between flex-nowrap text-sm items-center rounded-md bg-white mb-3 px-2"
	class:dark-gradient-highlighted={currentScoreId === no.scoreId}
	title="🐍 {no.username} &#013;🏆 {no.score} (score) &#013;📏 {no.snakeLength} (length)"
>
	{#if i === 0}
		<img src="/assets/crown.png" alt="a crown" class="absolute -top-3 -left-2 -rotate-12 h-5" />
	{/if}
	<div class="flex flex-1 min-w-0">
		<div class="mr-1">
			{i + 1 + '.'}
		</div>
		<p class="text-ellipsis overflow-hidden whitespace-nowrap z-10 font-bold">
			{no.username}
		</p>
	</div>
	<ScoreBubble score={no.score} />
</div>
