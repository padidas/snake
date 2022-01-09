<script lang="ts">
	import Apple from '../components/Apple.svelte'
	import Controls from '../components/Controls.svelte'
	import EmptySquare from '../components/EmptySquare.svelte'
	import RestartButton from '../components/RestartButton.svelte'
	import ScoreSection from '../components/ScoreSection.svelte'
	import SnakeBody from '../components/SnakeBody.svelte'
	import SnakeHead from '../components/SnakeHead.svelte'
	import SquareContainer from '../components/SquareContainer.svelte'
	import SubContainer from '../components/Layout/SubContainer.svelte'
	import GameContainer from '../components/Layout/GameContainer.svelte'
	import GameBoard from '../components/GameBoard.svelte'
	import { browser } from '$app/env'
	import { getScores, saveScore } from '../firebase'
	import { onMount } from 'svelte'
	import type { Direction, HeadRotation, Square, Score } from '../model/Types'

	// states
	let squares: Array<Square> = []
	let snakeHead: Square
	let snakeBody: Square[]
	let food: Square
	let gameOver = false
	let direction: Direction = 'right'
	let growing: boolean = false
	let lastFoodPos: Square
	let growPos: Square
	let score = 0
	let username = browser ? window.localStorage.getItem('username') ?? '' : ''
	let highscore: Score
	let nextBodyPartPos: Square
	let snakeBodyWithoutFirst: Square[]
	let lastSnakeBodyPart: Square
	let headRotation: HeadRotation

	// constants
	const squaresMax = 14
	const initialSnakeHead: Square = [4, 3]
	const initialSnakeBody: Square[] = [[4, 2]]
	// TODO: remove initial snakeBody
	// -> nessessary to check if snakeBody is not empty in other code blocks

	snakeHead = initialSnakeHead
	snakeBody = initialSnakeBody
	nextBodyPartPos = snakeHead
	food = [8, 6]

	onMount(async () => {
		getCurrentScores()
	})

	const getCurrentScores = async () => {
		const res = await getScores()
		highscore = await res
	}

	$: lastSnakeBodyPart = snakeBody[snakeBody.length - 1]

	// eating
	$: if (food[0] == snakeHead[0] && food[1] == snakeHead[1]) {
		score = score + 1
		growPos = food
		resetFood()
		growing = true
	}

	// checking when to grow
	$: {
		if (growing == true) {
			if (lastSnakeBodyPart[0] === growPos[0] && lastSnakeBodyPart[1] === growPos[1]) grow()
		}
	}

	$: console.log('lastFoodPos', lastFoodPos)
	$: console.log('food', food)
	$: console.log('growPos', growPos)

	const grow = () => {
		snakeBody = [...snakeBody, growPos]
		growing = false
	}

	const resetFood = () => {
		lastFoodPos = food
		do {
			food = [Math.floor(Math.random() * squaresMax), Math.floor(Math.random() * squaresMax)]
		} while (snakeBody.some(elem => elem[0] === food[0] && elem[1] === food[1]))
	}

	const initGameBoard = () => {
		for (let i = 0; i < squaresMax; i++) {
			for (let j = 0; j < squaresMax; j++) {
				squares.push([i, j])
			}
		}
	}
	initGameBoard()

	$: snakeBodyWithoutFirst = snakeBody.filter((_, i) => i !== 0)

	// collision detection (body)
	$: if (snakeBodyWithoutFirst.some(elem => elem[0] === snakeHead[0] && elem[1] === snakeHead[1])) {
		console.log('COLLISION WITH SNAKE BODY')
		gameOver = true
	}

	// collision detection (wall)
	$: if (
		snakeHead[0] >= squaresMax ||
		snakeHead[0] < 0 ||
		snakeHead[1] >= squaresMax ||
		snakeHead[1] < 0
	) {
		console.log('COLLISION WITH WALL')
		gameOver = true
	}

	// let snakeHead move in an interval
	const ms = 100
	let clear: any
	$: {
		clearInterval(clear)
		clear = setInterval(moveSnakeHead, ms)
	}

	const moveSnakeHead = () => {
		if (gameOver) return
		switch (direction) {
			case 'up':
				snakeHead = [snakeHead[0] - 1, snakeHead[1]]
				break
			case 'down':
				snakeHead = [snakeHead[0] + 1, snakeHead[1]]
				break
			case 'left':
				snakeHead = [snakeHead[0], snakeHead[1] - 1]
				break
			case 'right':
				snakeHead = [snakeHead[0], snakeHead[1] + 1]
				break
			default:
				break
		}
	}

	$: nextBodyPartPos = snakeHead

	// move snakeBody depending on snakeHead
	$: snakeBody = snakeBody?.map(elem => {
		snakeHead // this line is only for reactivity
		let newPos = nextBodyPartPos
		nextBodyPartPos = elem
		return newPos
	})

	const restart = () => {
		snakeHead = initialSnakeHead
		snakeBody = initialSnakeBody
		direction = 'right'
		gameOver = false
		score = 0
	}

	$: if (gameOver) {
		saveNewScore()
	}

	const saveNewScore = async () => {
		await saveScore({ username, score })
		getCurrentScores()
	}

	// snakeHead rotation
	$: switch (direction) {
		case 'up':
			headRotation = '0deg'
			break
		case 'down':
			headRotation = '180deg'
			break
		case 'left':
			headRotation = '270deg'
			break
		case 'right':
			headRotation = '90deg'
			break
		default:
			break
	}

	// controlls & key events
	const handleKeydown = e => {
		if (e.code === 'ArrowDown') e.preventDefault()
		if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'KeyI') goUp()
		else if (e.code === 'ArrowDown' || e.code === 'KeyS' || e.code === 'KeyK') goDown()
		else if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyJ') goLeft()
		else if (e.code === 'ArrowRight' || e.code === 'KeyD' || e.code === 'KeyL') goRight()
	}

	const goUp = () => {
		if (direction !== 'down') direction = 'up'
	}

	const goDown = () => {
		if (direction !== 'up') direction = 'down'
	}

	const goLeft = () => {
		if (direction !== 'right') direction = 'left'
	}

	const goRight = () => {
		if (direction !== 'left') direction = 'right'
	}

	const rotateRight = () => {
		if (direction === 'left') direction = 'up'
		else if (direction === 'up') direction = 'right'
		else if (direction === 'right') direction = 'down'
		else if (direction === 'down') direction = 'left'
	}

	const rotateLeft = () => {
		if (direction === 'left') direction = 'down'
		else if (direction === 'down') direction = 'right'
		else if (direction === 'right') direction = 'up'
		else if (direction === 'up') direction = 'left'
	}
</script>

<svelte:window on:keydown|={handleKeydown} />

<GameContainer>
	<SubContainer>
		<div class="flex w-[344px] justify-between items-center mb-2">
			<ScoreSection {username} {score} {highscore} />
		</div>
		<GameBoard {gameOver}>
			{#each squares as square}
				<SquareContainer>
					{#if snakeBody.some(box => box[0] == square[0] && box[1] == square[1])}
						<SnakeBody />
					{:else if snakeHead[0] == square[0] && snakeHead[1] == square[1]}
						<SnakeHead {headRotation} />
					{:else if food[0] == square[0] && food[1] == square[1]}
						<Apple />
					{:else}
						<EmptySquare />
					{/if}
				</SquareContainer>
			{/each}
		</GameBoard>
		<div class="flex flex-1 w-full h-[50px] justify-around items-center">
			<div>
				Snake Length: {snakeBody.length}
			</div>
			<div>
				<RestartButton {restart} />
			</div>
		</div>
	</SubContainer>
	<SubContainer>
		<Controls {goDown} {goLeft} {goUp} {goRight} {rotateLeft} {rotateRight} />
	</SubContainer>
</GameContainer>

<style global>
	.growing {
		background-color: darkgreen !important;
	}
</style>
