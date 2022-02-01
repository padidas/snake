<script lang="ts">
	export let square
</script>

<div
	class:rounded-tl={square[0] == 0 && square[1] == 0}
	class:rounded-tr={square[0] == 0 && square[1] == 13}
	class:rounded-bl={square[0] == 13 && square[1] == 0}
	class:rounded-br={square[0] == 13 && square[1] == 13}
	class="flex w-full h-full rounded-xs items-center justify-center"
>
	<slot />
</div>
