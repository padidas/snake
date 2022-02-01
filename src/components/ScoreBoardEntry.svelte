<script lang="ts">
	import type { Score } from '../model/Types'
	import ScoreBubble from './ScoreBubble.svelte'

	export let no: Score
	export let i: number
	export let currentScoreId: string = ''
</script>

<div
	class="relative flex w-[156px] h-11 font-semibold justify-between text-sm items-center rounded-md bg-opacity-10 bg-white mb-3 px-2"
	class:dark-gradient-highlighted={currentScoreId === no.scoreId}
	title="snake length: {no.snakeLength}"
>
	{#if i === 0}
		<img src="/assets/crown.png" alt="a crown" class="absolute -top-3 -left-2 -rotate-12 h-5" />
	{/if}
	<div>{i + 1 + '.'}</div>
	<div class="flex flex-col flex-grow ml-2 mr-1">
		<div>
			{no.username}
		</div>
	</div>
	<ScoreBubble score={no.score} />
</div>
