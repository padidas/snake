<script lang="ts">
	export let restart: () => void
</script>

<button
	on:click={restart}
	class="w-[100px] h-[24px] rounded-full dark-gradient border-2 font-bold text-xs shadow flex justify-center items-center z-10 bg-white hover:bg-slate-100 active:bg-slate-200 focus:outline-none active:ring active:ring-slate-400"
	>RESTART</button
>
