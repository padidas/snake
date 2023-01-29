<script lang="ts">
	import { fade } from 'svelte/transition'
	export let onClickFunction
	export let username
</script>

<div
	out:fade={{ duration: 400 }}
	class="flex flex-col justify-center rounded items-center bg-black bg-opacity-70 w-[336px] absolute top-0 bottom-0 m-auto left-0 right-0 z-30"
>
	{#if !username}
		<p
			in:fade={{ delay: 100, duration: 1000 }}
			out:fade={{ duration: 400 }}
			class="text-white font-extrabold text-3xl mb-5"
		>
			Enter username
		</p>{/if}
	<button
		class="w-[100px] h-[24px] rounded-full dark-gradient border-2 font-bold text-xs shadow flex justify-center items-center z-10 bg-white hover:bg-slate-100 active:bg-slate-200 focus:outline-none active:ring active:ring-slate-400"
		on:click={onClickFunction}
	>
		PLAY!
	</button>
</div>
