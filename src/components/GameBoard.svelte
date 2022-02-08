<div
	class="relative w-[336px] h-[336px] flex flex-wrap shadow-lg dark-gradient rounded gameboard-bg"
>
	<slot />
</div>

<style>
	.gameboard-bg {
		background-image: url('/assets/gameboard.png');
		background-repeat: no-repeat;
		background-position-x: center;
	}
</style>
