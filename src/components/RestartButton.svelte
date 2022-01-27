<script lang="ts">
	export let restart: () => void
</script>

<button
	on:click={restart}
	class="w-[100px] h-[24px] rounded-full dark-gradient border-2 font-bold text-xs text-white shadow flex justify-center items-center z-10"
	>RESTART</button
>
