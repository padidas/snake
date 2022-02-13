<script lang="ts">
	import GameBoardTile from '../components/GameBoardTile.svelte'
	import RestartButton from '../components/RestartButton.svelte'
	import ScoreSection from '../components/ScoreSection.svelte'
	import SnakeBody from '../components/SnakeBody.svelte'
	import SnakeHead from '../components/SnakeHead.svelte'
	import SquareContainer from '../components/SquareContainer.svelte'
	import SubContainer from '../components/Layout/SubContainer.svelte'
	import GameContainer from '../components/Layout/GameContainer.svelte'
	import GameBoard from '../components/GameBoard.svelte'
	import ScoreBoard from '../components/ScoreBoard.svelte'
	import { onMount } from 'svelte'
	import type { Direction, HeadRotation, Square, Score } from '../model/Types'
	import ObjectId from 'bson-objectid'
	import { privateMode, username } from '../stores'
	import GameOverText from '../components/GameOverText.svelte'
	import SnakeLengthInfo from '../components/SnakeLengthInfo.svelte'
	import ActivePlayers from '../components/ActivePlayers.svelte'
	import axios from 'axios'
	import Bowser from 'bowser'
	import TouchControl from '../components/TouchControl.svelte'
	import ButtonControl from '../components/ButtonControl.svelte'

	// states //
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
	let scores: Score[] = []
	let currentScoreId: string = ObjectId().toHexString()
	let nextBodyPartPos: Square
	let snakeBodyWithoutFirst: Square[]
	let lastSnakeBodyPart: Square
	let headRotation: HeadRotation
	let gameOverKeydownCount = 0
	let apple = '/assets/apple.svg'
	let banana = '/assets/banana.svg'
	let avocado = '/assets/avocado.svg'
	let appleOrBanana = 0
	let rotationQueue: Direction[] = []
	let shouldUseSwipeControl: boolean = false

	// constants //
	const SQUARES_MAX = 14
	const INITIAL_SNAKE_HEAD: Square = [4, 3]
	const INITIAL_SNAKE_BODY: Square[] = [[4, 2]]
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
	const GET_SCORES_INTERVAL_IN_MS = +import.meta.env.VITE_GET_SCORES_INTERVAL_IN_MS

	// initialization //
	snakeHead = INITIAL_SNAKE_HEAD
	snakeBody = INITIAL_SNAKE_BODY
	nextBodyPartPos = snakeHead
	food = [8, 6]

	const fetchTopScores = async (): Promise<void> => {
		console.log('fetchTopScores')
		const res = await axios.get(`${BACKEND_URL}/scores/topScores`)
		scores = res.data.map(elem => ({
			scoreId: elem.id,
			username: elem.username,
			score: elem.score,
			snakeLength: elem.snakeLength,
		}))
	}

	onMount(async () => {
		setInterval(fetchTopScores, GET_SCORES_INTERVAL_IN_MS)
		setInterval(moveSnakeHead, SNAKE_SPEED_DEPENDING_ON_BROWSER())
	})

	const SNAKE_SPEED_DEPENDING_ON_BROWSER = () =>
		Bowser.getParser(window.navigator.userAgent).getEngineName() == 'Gecko' ? 94 : 100

	$: lastSnakeBodyPart = snakeBody[snakeBody.length - 1]

	// eating
	$: if (food[0] == snakeHead[0] && food[1] == snakeHead[1]) {
		score = score + 1
		growPos = food
		resetFood()
		growing = true
		saveNewScore()
	}

	const grow = () => {
		snakeBody = [...snakeBody, growPos]
		growing = false
	}

	const resetFood = () => {
		lastFoodPos = food
		appleOrBanana = Math.floor(Math.random() * 3)
		do {
			food = [Math.floor(Math.random() * SQUARES_MAX), Math.floor(Math.random() * SQUARES_MAX)]
		} while (snakeBody.some(elem => elem[0] === food[0] && elem[1] === food[1]))
	}

	const initGameBoard = () => {
		for (let i = 0; i < SQUARES_MAX; i++) {
			for (let j = 0; j < SQUARES_MAX; j++) {
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

	// allow snake to go through walls
	$: {
		if (snakeHead[0] >= SQUARES_MAX) snakeHead[0] = 0
		if (snakeHead[0] < 0) snakeHead[0] = SQUARES_MAX - 1
		if (snakeHead[1] >= SQUARES_MAX) snakeHead[1] = 0
		if (snakeHead[1] < 0) snakeHead[1] = SQUARES_MAX - 1
	}

	const moveSnakeHead = () => {
		if (gameOver) return
		direction = rotationQueue[0] ?? direction
		rotationQueue = rotationQueue.filter((elem, i) => i != 0)

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

		if (growing == true) {
			if (lastSnakeBodyPart[0] === growPos[0] && lastSnakeBodyPart[1] === growPos[1]) grow()
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
		snakeHead = INITIAL_SNAKE_HEAD
		snakeBody = INITIAL_SNAKE_BODY
		direction = 'right'
		gameOver = false
		score = 0
		currentScoreId = ObjectId().toHexString()
		growing = false
	}

	const toggleControlMode = () => (shouldUseSwipeControl = !shouldUseSwipeControl)

	const saveNewScore = async () => {
		console.log('SAVE NEW SCORE')
		await axios.post(`${BACKEND_URL}/scores`, {
			scoreId: currentScoreId,
			username: $username,
			score: score,
			snakeLength: snakeBody.length,
			privateMode: $privateMode,
		})
		fetchTopScores()
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

	const restartGameOnKeydownIfGameOver = () => {
		gameOverKeydownCount += 1
		if (gameOverKeydownCount >= 2) {
			gameOverKeydownCount = 0
			restart()
		}
	}

	// controlls & key events
	const handleKeydown = e => {
		const key = e.code
		if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'ArrowLeft' || key === 'ArrowRight')
			e.preventDefault()

		if (gameOver) {
			restartGameOnKeydownIfGameOver()
			return
		}

		if (key === 'ArrowUp' || key === 'KeyW' || key === 'KeyI') rotateSnake('up', 'down')
		else if (key === 'ArrowDown' || key === 'KeyS' || key === 'KeyK') rotateSnake('down', 'up')
		else if (key === 'ArrowLeft' || key === 'KeyA' || key === 'KeyJ') rotateSnake('left', 'right')
		else if (key === 'ArrowRight' || key === 'KeyD' || key === 'KeyL') rotateSnake('right', 'left')
	}

	const rotateSnake = (newDirection: Direction, oppositeDirection: Direction) => {
		if (
			direction === oppositeDirection ||
			rotationQueue.includes(newDirection) ||
			rotationQueue.includes(oppositeDirection)
		)
			return
		else rotationQueue = [...rotationQueue, newDirection]
	}

	// const rotateRight = () => {
	// 	if (direction === 'left') direction = 'up'
	// 	else if (direction === 'up') direction = 'right'
	// 	else if (direction === 'right') direction = 'down'
	// 	else if (direction === 'down') direction = 'left'
	// }

	// const rotateLeft = () => {
	// 	if (direction === 'left') direction = 'down'
	// 	else if (direction === 'down') direction = 'right'
	// 	else if (direction === 'right') direction = 'up'
	// 	else if (direction === 'up') direction = 'left'
	// }
</script>

<svelte:window on:keydown|={handleKeydown} />

<GameContainer>
	<SubContainer>
		<ScoreSection {score} />
		<GameBoard>
			{#if gameOver}
				<GameOverText />
			{/if}
			{#each squares as square}
				<SquareContainer>
					{#if snakeBody.some(box => box[0] == square[0] && box[1] == square[1])}
						<SnakeBody {growing} />
					{:else if snakeHead[0] == square[0] && snakeHead[1] == square[1]}
						<SnakeHead {headRotation} {growing} />
					{:else if food[0] == square[0] && food[1] == square[1]}
						<GameBoardTile {square}>
							{#if appleOrBanana === 0}
								<img src={apple} alt="an apple" />
							{:else if appleOrBanana === 1}
								<img src={banana} alt="a banana" />
							{:else}
								<img src={avocado} alt="a banana" />
							{/if}
						</GameBoardTile>
					{:else}
						<GameBoardTile {square} />
					{/if}
				</SquareContainer>
			{/each}
		</GameBoard>
		<div class="flex w-[336px] h-[40px] justify-between text-sm font-semibold items-center">
			<button
				on:click={toggleControlMode}
				class="w-[100px] h-[24px] rounded-full dark-gradient border-2 font-bold text-xs shadow flex justify-center items-center z-10 bg-white hover:bg-slate-100 active:bg-slate-200 focus:outline-none active:ring active:ring-slate-400"
				>{#if shouldUseSwipeControl}
					USE BUTTONS
				{:else}
					USE SWIPE
				{/if}</button
			>
			<SnakeLengthInfo snakeLengthInfo={snakeBody.length} />
			<RestartButton {restart} />
		</div>
	</SubContainer>
	{#if shouldUseSwipeControl}
		<TouchControl {rotateSnake} />
	{:else}
		<ButtonControl {rotateSnake} />
	{/if}
	<SubContainer>
		<ScoreBoard {scores} {currentScoreId} />
	</SubContainer>
	<SubContainer>
		<ActivePlayers />
	</SubContainer>
</GameContainer>
