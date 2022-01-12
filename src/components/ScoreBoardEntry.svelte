<script lang="ts">
	import type { Score } from '../model/Types'

	export let no: Score
	export let i: number
	export let currentScoreId: string = ''
</script>

<div
	class:highlighted={currentScoreId === no.scoreId}
	class="flex w-5/12 h-11 font-semibold justify-between text-sm items-center rounded-md bg-emerald-600 shadow-lg mb-3 pl-2 pr-1"
>
	<div>{i + 1}.</div>
	<div class="flex flex-col flex-grow ml-2 mr-1">
		<div>
			{no.username}
		</div>
		{#if no.snakeLength}
			<div class="text-xs">
				length: {no.snakeLength}
			</div>
		{/if}
	</div>
	<div
		class="flex justify-center items-center border border-gray-800 bg-emerald-200 text-black rounded-full w-6 h-6"
	>
		{no.score}
	</div>
</div>

<style>
	.highlighted {
		box-shadow: 0px 0px 10px rgb(226, 226, 226);
	}
</style>
