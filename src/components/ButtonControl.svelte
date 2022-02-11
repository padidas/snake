<script lang="ts">
	import Controls from './Controls.svelte'

	export let rotateSnake: any
</script>

<div class="flex flex-col w-[336px] justify-center items-center md:hidden">
	<div>
		<Controls icon={0} controlFunction={() => rotateSnake('up', 'down')} />
	</div>
	<div class="flex w-full justify-between">
		<Controls icon={'left'} controlFunction={() => rotateSnake('left', 'right')} />
		<Controls icon={'right'} controlFunction={() => rotateSnake('right', 'left')} />
	</div>
	<div>
		<Controls icon={'down'} controlFunction={() => rotateSnake('down', 'up')} />
	</div>
</div>
