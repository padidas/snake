<script lang="ts">
	export let controlFunction: () => void
	export let label: string
</script>

<div
	on:click={controlFunction}
	class="flex justify-center uppercase items-center dark-gradient rounded-full border-2 border-white w-40"
>
	{label}
</div>
