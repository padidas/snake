<script lang="ts">
	// import { browser } from '$app/env'
	import { username } from '../stores'

	export let score: number

	// $: if (browser) window.localStorage.setItem('username', $username)
</script>

<div>Es spielt</div>
<input
	class="bg-transparent h-8 border-2 px-2 rounded bg-emerald-100 border-blue-300 w-[160px] font-bold text-gray-600 text-lg"
	placeholder="Name..."
	bind:value={$username}
/>
<div
	class="bg-transparent h-8 border-2 text-center w-16 px-2 rounded bg-emerald-100 border-blue-300 font-bold text-gray-600 text-lg"
>
	{score}
</div>
