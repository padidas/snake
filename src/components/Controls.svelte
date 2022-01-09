<script lang="ts">
	export let rotateLeft: () => void
	export let rotateRight: () => void
	export let goUp: () => void
	export let goLeft: () => void
	export let goRight: () => void
	export let goDown: () => void
</script>

<div class="flex w-[320px] justify-around items-center">
	<button
		on:click={rotateLeft}
		class="flex flex-col items-center justify-center w-[100px] h-[70px] bg-blue-300 rounded-full font-bold"
		>{'turn left'}</button
	>
	<button
		on:click={rotateRight}
		class="flex flex-col items-center justify-center w-[100px] h-[70px] bg-blue-300 rounded-full font-bold"
		>{'turn right'}</button
	>
</div>
<div class="flex w-[320px] justify-around items-center">
	<button
		on:click={goUp}
		class="flex flex-col items-center justify-center w-[100px] h-[100px] bg-blue-300 rounded-full font-extrabold"
		>{'^'}</button
	>
</div>
<div class="flex w-[320px] justify-around items-center -my-3">
	<button
		on:click={goLeft}
		class="flex flex-col items-center justify-center w-[100px] h-[100px] bg-blue-300 rounded-full font-extrabold"
		>{'<'}</button
	>
	<button
		on:click={goRight}
		class="flex flex-col items-center justify-center w-[100px] h-[100px] bg-blue-300 rounded-full font-extrabold"
		>{'>'}</button
	>
</div>
<div class="flex w-[320px] justify-around items-center">
	<button
		on:click={goDown}
		class="flex flex-col items-center justify-center w-[100px] h-[100px] bg-blue-300 rounded-full font-extrabold"
		>{'v'}</button
	>
</div>
