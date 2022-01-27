<script lang="ts">
	// import { browser } from '$app/env'
	import { username } from '../stores'

	export let score: number

	// $: if (browser) window.localStorage.setItem('username', $username)
</script>

<input
	class="h-8 border-2 px-2 rounded bg-gradient-to-br from-cyan-900 to-black border-blue-300 font-bold text-gray-600 text-lg"
	placeholder="Dein Name..."
	bind:value={$username}
	on:keydown|stopPropagation
/>
<div
	class="h-8 border-2 text-center w-16 px-2 rounded bg-gradient-to-br from-cyan-900 to-black border-blue-300 font-bold  text-lg"
>
	{score}
</div>
