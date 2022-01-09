<script lang="ts">
	export let restart: () => void
</script>

<button
	on:click={restart}
	class="w-[100px] h-[20px] rounded-full bg-red-600 font-bold border-2 border-white flex justify-center items-center z-10"
	>RESTART</button
>
