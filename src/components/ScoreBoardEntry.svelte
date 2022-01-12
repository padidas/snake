<script lang="ts">
	import type { Score } from '../model/Types'

	export let no: Score
	export let i: number
	export let currentScoreId: string = ''
</script>

<div
	class:current={currentScoreId === no.scoreId}
	class="flex w-5/12 h-11 font-semibold justify-between text-sm items-center bg-emerald-100 text-black border-2 border-gray-700 rounded-lg mb-3 pl-2 pr-1"
>
	<div>{i + 1}.</div>
	<div class="flex flex-col flex-grow mx-1">
		<div>
			{no.username}
		</div>
		{#if no.snakeLength}
			<div class="text-xs">
				length: {no.snakeLength ?? ''}
			</div>
		{/if}
	</div>
	<div class="flex justify-center items-center">
		<div class="flex justify-center items-center text-white bg-teal-600 rounded-full w-6 h-6">
			{no.score}
		</div>
	</div>
</div>
