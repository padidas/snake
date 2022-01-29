<script lang="ts">
	export let controlFunction: () => void
	export let label: string
</script>

<button
	on:click={controlFunction}
	class="flex justify-center uppercase items-center dark-gradient rounded-md border-2 border-white w-40"
>
	{label}
</button>
