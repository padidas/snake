<script lang="ts">
	type HeadRotation = '0deg' | '90deg' | '180deg' | '270deg'

	export let headRotation: HeadRotation
	export let growing
</script>

<div class="relative z-20" style="transform:rotate({headRotation})">
	<div class="w-[24px] h-[24px] snake-color rounded-t-full" class:growing />
	<div class="absolute w-[5px] h-[5px] rounded-full bg-gray-900 top-[12px] left-[3px]" />
	<div class="absolute w-[5px] h-[5px] rounded-full bg-gray-900 top-[12px] right-[3px]" />
	<div class="absolute w-[2px] h-[2px] rounded-full bg-gray-900 top-[5px] left-[5px]" />
	<div class="absolute w-[2px] h-[2px] rounded-full bg-gray-900 top-[5px] right-[5px]" />
	<div class="absolute w-[2px] h-[2px] rounded-full bg-gray-200 top-[13px] left-[5px]" />
	<div class="absolute w-[2px] h-[2px] rounded-full bg-gray-200 top-[13px] right-[5px]" />
</div>
