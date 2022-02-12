<script>
	import { makeSvelteController } from './controller.js'
	import { MouseController } from './mouse-controller.js'
	const mouse = makeSvelteController(host => new MouseController(host))
</script>

<div id="joystick" class="h-24 w-44 bg-slate-500">
	x: {$mouse.pos.x}
	y: {$mouse.pos.y}
</div>
