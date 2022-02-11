<script lang="ts">
	export let icon: any
	export let controlFunction: () => void
</script>

<button
	on:mousedown|stopPropagation|preventDefault={controlFunction}
	on:touchstart|stopPropagation|preventDefault={controlFunction}
	on:click|stopPropagation|preventDefault
	on:touchmove|stopPropagation|preventDefault
	class="flex justify-center uppercase items-center rounded-full shadow-md h-20 w-32 bg-white hover:bg-slate-100 active:bg-slate-200 focus:outline-none active:ring active:ring-slate-400"
>
	<i class="chevron {icon}" />
</button>

<style>
	.chevron::before {
		border-style: solid;
		border-color: darkslategray;
		border-width: 0.1em 0.1em 0 0;
		content: '';
		display: inline-block;
		height: 0.45em;
		left: 0.15em;
		position: relative;
		transform: rotate(-45deg);
		vertical-align: middle;
		width: 0.45em;
	}

	.chevron.right:before {
		right: 0;
		transform: rotate(45deg);
	}

	.chevron.down:before {
		top: 0;
		transform: rotate(135deg);
	}

	.chevron.left:before {
		left: 0;
		transform: rotate(-135deg);
	}
</style>
