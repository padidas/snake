<script lang="ts">
	import { username } from '../stores'
	import ScoreBubble from './ScoreBubble.svelte'

	export let score: number
</script>

<div class="flex w-[336px] h-[40px] justify-between items-center">
	<input
		class="flex flex-1 h-6 px-2 rounded dark-gradient backdrop-filter backdrop-blur-lg font-semibold mr-4"
		placeholder="Name..."
		bind:value={$username}
		on:keydown|stopPropagation
	/>
	<ScoreBubble {score} />
</div>
