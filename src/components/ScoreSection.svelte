<script lang="ts">
	import { username } from '../stores'

	export let score: number
</script>

<div class="flex w-[336px] h-[50px] justify-between items-center">
	<input
		class="h-8 px-2 rounded dark-gradient backdrop-filter backdrop-blur-lg font-semibold w-full mr-4 text-lg"
		placeholder="your name..."
		bind:value={$username}
		on:keydown|stopPropagation
	/>
	<div
		class="w-12 flex justify-center items-center shadow-md text-center h-8 rounded-full px-2 bg-amber-300 text-black font-bold text-lg"
	>
		{score}
	</div>
</div>
