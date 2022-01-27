<script lang="ts">
	export let restart: () => void
</script>

<button
	on:click={restart}
	class="w-[100px] h-[24px] rounded-full bg-gradient-to-br from-cyan-900 to-black font-bold text-white shadow flex justify-center items-center z-10"
	>restart</button
>
