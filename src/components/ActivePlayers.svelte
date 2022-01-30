<script lang="ts">
	export let activeScores = []
</script>

<div
	class="w-[172px] h-[336px] flex flex-col bg-opacity-25 bg-white backdrop-blur-lg shadow-lg rounded mb-4 md:mb-0"
>
	<div class="flex flex-col font-extrabold text-xl p-3 text-sky-900 items-center">
		<div>Active Players</div>
	</div>
	<div class="flex flex-col flex-wrap h-[300px] items-center">
		{#each activeScores as activeScore}
			<div class="flex m-1">
				<div>
					{activeScore.username}
				</div>
				<div
					class="flex justify-center items-center bg-amber-300 text-black font-bold rounded-full w-6 h-6 ml-2"
				>
					{activeScore.score}
				</div>
			</div>
		{/each}
	</div>
</div>
