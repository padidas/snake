<script lang="ts">
	type HeadRotation = '0deg' | '90deg' | '180deg' | '270deg'

	export let headRotation: HeadRotation
	export let growing
</script>

<div class="relative z-20" style="transform:rotate({headRotation})">
	<div class:growing class="w-[24px] h-[24px] bg-green-600 rounded-t-full" />
	<div class="absolute w-[6px] h-[6px] rounded-full bg-orange-400 top-[6px] left-[3px]" />
	<div class="absolute w-[6px] h-[6px] rounded-full bg-orange-400 top-[6px] right-[3px]" />
</div>
