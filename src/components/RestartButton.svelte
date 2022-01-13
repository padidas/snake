<script lang="ts">
	export let restart: () => void
</script>

<button
	on:click={restart}
	class="w-[100px] h-[24px] rounded-full bg-red-600 font-bold shadow flex justify-center items-center z-10"
	>restart</button
>
