<script lang="ts">
	import type { Score } from '../model/Types'

	export let scores: Score[] = []
</script>

<div class="w-[344px] flex flex-col bg-yellow-300 border-4 rounded border-white">
	{#each scores as no}
		<div class="flex bg-white text-black border-2 border-gray-700 rounded-full m-1 px-4">
			{no.username} - {no.score}
		</div>
	{/each}
</div>
