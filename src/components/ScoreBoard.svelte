<script lang="ts">
	import type { Score } from '../model/Types'
	import ScoreBoardEntry from './ScoreBoardEntry.svelte'

	export let scores: Score[] = []
	export let currentScoreId: string = ''
</script>

<div
	class="w-[344px] h-[336px] flex flex-col mt-[40px] bg-opacity-25 backdrop-filter backdrop-blur-lg shadow-lg rounded"
>
	<div class="flex flex-col  font-extrabold text-xl p-3 text-sky-900 items-center">
		<div>Score Board</div>
	</div>
	<div class="flex flex-col flex-wrap h-[300px] items-center">
		{#each scores as no, i}
			<ScoreBoardEntry {no} {i} {currentScoreId} />
		{/each}
	</div>
</div>
