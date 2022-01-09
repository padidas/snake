<script lang="ts">
	import { browser } from '$app/env';

	type Highscore = {
		username: string;
		score: number;
	};

	export let username: string;
	export let score: number;
	export let highscore: Highscore;

	$: if (browser) window.localStorage.setItem('username', username);
</script>

<input
	class="bg-transparent h-16 border-4 text-center rounded-xl border-blue-300 w-[140px] font-extrabold text-2xl"
	bind:value={username}
/>
<div
	class="border-4 rounded-xl border-blue-300 w-20 h-16 flex justify-center items-center font-extrabold text-2xl"
>
	{score}
</div>
<div
	class="flex flex-col justify-center items-center w-20 h-16 rounded-xl border-4 border-yellow-400"
>
	<div class="font-semibold">
		{highscore.username}
	</div>
	<div class="font-extrabold text-2xl">
		{highscore.score}
	</div>
</div>
