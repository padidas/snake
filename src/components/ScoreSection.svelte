<script lang="ts">
	import { currentScore } from '../stores/ScoreStore'
	import { username } from '../stores'
	import { onMount } from 'svelte'
	import ScoreBubble from './ScoreBubble.svelte'

	onMount(() => {
		username.set(window.localStorage.storedUsername ?? '')
		username.subscribe(un => (window.localStorage.storedUsername = un))
	})
</script>

<div class="flex w-[336px] h-[40px] justify-between items-center">
	<input
		class="flex flex-1 h-6 px-2 rounded dark-gradient backdrop-filter backdrop-blur-lg font-semibold mr-4"
		placeholder="Name..."
		bind:value={$username}
		on:keydown|stopPropagation
	/>
	<ScoreBubble score={$currentScore} />
</div>
