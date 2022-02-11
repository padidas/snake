<script lang="ts">
	export let rotateSnake: any

	let initialX = null
	let initialY = null

	const startTouch = e => {
		initialX = e.touches[0].clientX
		initialY = e.touches[0].clientY
	}

	const moveTouch = e => {
		if (initialX === null) return
		if (initialY === null) return

		let currentX = e.touches[0].clientX
		let currentY = e.touches[0].clientY

		let diffX = initialX - currentX
		let diffY = initialY - currentY

		if (Math.abs(diffX) > Math.abs(diffY)) {
			// sliding horizontally
			if (diffX > 0) {
				rotateSnake('left', 'right')
				console.log('swiped left')
			} else {
				rotateSnake('right', 'left')
				console.log('swiped right')
			}
		} else {
			// sliding vertically
			if (diffY > 0) {
				rotateSnake('up', 'down')
				console.log('swiped up')
			} else {
				rotateSnake('down', 'up')
				console.log('swiped down')
			}
		}

		initialX = null
		initialY = null

		e.preventDefault()
	}
</script>

<div
	on:touchstart={startTouch}
	on:touchmove|stopPropagation|preventDefault={moveTouch}
	class="flex font-extrabold text-3xl text-slate-200 flex-col w-[344px] h-52 justify-center items-center bg-white rounded-md md:hidden"
>
	SWIPE
</div>
