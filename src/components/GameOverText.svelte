<script lang="ts">
	import { fade, fly } from 'svelte/transition'
</script>

<div
	out:fade={{ duration: 400 }}
	class="flex flex-col justify-center font-serif items-center bg-black w-[336px] absolute top-0 bottom-0 m-auto left-0 right-0 z-10"
>
	<p
		in:fade={{ delay: 400, duration: 1400 }}
		out:fade={{ duration: 400 }}
		class="text-red-700 font-extrabold text-3xl"
	>
		YOU DIED
	</p>
	<p
		in:fade={{ delay: 1400, duration: 1000 }}
		out:fade={{ duration: 400 }}
		class="text-red-700 font-extrabold text"
	>
		press any key to retry
	</p>
</div>
