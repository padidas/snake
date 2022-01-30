<script lang="ts">
	import GameBoardTile from '../components/GameBoardTile.svelte'
	import RestartButton from '../components/RestartButton.svelte'
	import ScoreSection from '../components/ScoreSection.svelte'
	import SnakeBody from '../components/SnakeBody.svelte'
	import SnakeHead from '../components/SnakeHead.svelte'
	import SquareContainer from '../components/SquareContainer.svelte'
	import SubContainer from '../components/Layout/SubContainer.svelte'
	import GameContainer from '../components/Layout/GameContainer.svelte'
	import Controls from '../components/Controls.svelte'
	import GameBoard from '../components/GameBoard.svelte'
	import ScoreBoard from '../components/ScoreBoard.svelte'
	import { onMount } from 'svelte'
	import type { Direction, HeadRotation, Square, Score } from '../model/Types'
	import ObjectId from 'bson-objectid'
	import { username } from '../stores'
	import GameOverText from '../components/GameOverText.svelte'
	import SnakeLengthInfo from '../components/SnakeLengthInfo.svelte'
	import ActivePlayers from '../components/ActivePlayers.svelte'
	import axios from 'axios'

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
	let activeScores: Score[] = []
	let currentScoreId: string = ObjectId().toHexString()
	let highscore: Score
	let nextBodyPartPos: Square
	let snakeBodyWithoutFirst: Square[]
	let lastSnakeBodyPart: Square
	let headRotation: HeadRotation
	let gameOverKeydownCount = 0
	let apple = '/assets/apple.svg'
	let banana = '/assets/banana.svg'
	let avocado = '/assets/avocado.svg'
	let appleOrBanana = 0

	// constants //
	const SQUARES_MAX = 14
	const INITIAL_SNAKE_HEAD: Square = [4, 3]
	const INITIAL_SNAKE_BODY: Square[] = [[4, 2]]
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
	const SNAKE_SPEED_IN_MS = 100
	const GET_SCORES_INTERVAL_IN_MS = 3000

	// initialization //
	snakeHead = INITIAL_SNAKE_HEAD
	snakeBody = INITIAL_SNAKE_BODY
	nextBodyPartPos = snakeHead
	food = [8, 6]

	const fetchTopScores = async (): Promise<void> => {
		console.log('fetchTopScores')
		const res = await axios.get(`${BACKEND_URL}/scores/topScores`)
		scores = res.data.map(elem => ({
			username: elem.username,
			score: elem.score,
			scoreId: elem.id,
			snakeLength: elem.snakeLength,
		}))
	}

	const fetchActiveScores = async (): Promise<void> => {
		console.log('fetchActiveScores')
		const res = await axios.get(`${BACKEND_URL}/scores/activeScores`)
		activeScores = res.data.map(elem => ({
			username: elem.username,
			score: elem.score,
			scoreId: elem.id,
			snakeLength: elem.snakeLength,
		}))
	}

	$: if (scores.length > 0)
		highscore = scores.reduce((a, b) => {
			if (a.score > b.score) return a
			else return b
		})

	onMount(async () => {
		getScores()
		setInterval(getScores, GET_SCORES_INTERVAL_IN_MS)
		setInterval(moveSnakeHead, SNAKE_SPEED_IN_MS)
	})

	const getScores = async () => {
		fetchTopScores()
		fetchActiveScores()
	}

	$: lastSnakeBodyPart = snakeBody[snakeBody.length - 1]

	// eating
	$: if (food[0] == snakeHead[0] && food[1] == snakeHead[1]) {
		score = score + 1
		growPos = food
		resetFood()
		growing = true
		saveNewScore()
	}

	// checking when to grow
	$: {
		if (growing == true) {
			if (lastSnakeBodyPart[0] === growPos[0] && lastSnakeBodyPart[1] === growPos[1]) grow()
		}
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

	// collision detection (wall)
	$: if (
		snakeHead[0] >= SQUARES_MAX ||
		snakeHead[0] < 0 ||
		snakeHead[1] >= SQUARES_MAX ||
		snakeHead[1] < 0
	) {
		console.log('COLLISION WITH WALL')
		gameOver = true
	}

	// // get scores in an interval
	// const GET_SCORES_INTERVAL_IN_MS = 3000
	// let clearGetScoresInterval: NodeJS.Timer
	// $: {
	// 	clearInterval(clearGetScoresInterval)
	// 	clearGetScoresInterval = setInterval(getCurrentScores, GET_SCORES_INTERVAL_IN_MS)
	// }

	// // let snakeHead move in an interval
	// const SNAKE_SPEED_IN_MS = 100
	// let clearMoveSnakeInterval: NodeJS.Timer
	// $: {
	// 	clearInterval(clearMoveSnakeInterval)
	// 	clearMoveSnakeInterval = setInterval(moveSnakeHead, SNAKE_SPEED_IN_MS)
	// }

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
		snakeHead = INITIAL_SNAKE_HEAD
		snakeBody = INITIAL_SNAKE_BODY
		direction = 'right'
		gameOver = false
		score = 0
		currentScoreId = ObjectId().toHexString()
		growing = false
	}

	const saveNewScore = async () => {
		console.log('SAVE NEW SCORE')
		await axios.post(`${BACKEND_URL}/scores`, {
			scoreId: currentScoreId,
			username: $username,
			score: score,
			snakeLength: snakeBody.length,
		})
		getScores()
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
		if (gameOver) {
			restartGameOnKeydownIfGameOver()
			return
		}

		const key = e.code
		if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'ArrowLeft' || key === 'ArrowRight')
			e.preventDefault()
		if (key === 'ArrowUp' || key === 'KeyW' || key === 'KeyI') goUp()
		else if (key === 'ArrowDown' || key === 'KeyS' || key === 'KeyK') goDown()
		else if (key === 'ArrowLeft' || key === 'KeyA' || key === 'KeyJ') goLeft()
		else if (key === 'ArrowRight' || key === 'KeyD' || key === 'KeyL') goRight()
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
		<div class="flex w-[336px] h-[50px] justify-between items-center">
			<SnakeLengthInfo snakeLengthInfo={snakeBody.length} />
			<RestartButton {restart} />
		</div>
	</SubContainer>
	<div class="flex w-[336px] h-16 justify-between md:hidden">
		<Controls controlFunction={rotateLeft} label={'turn left'} />
		<Controls controlFunction={rotateRight} label={'turn right'} />
	</div>
	<SubContainer>
		<ScoreBoard {scores} {currentScoreId} />
	</SubContainer>
	<SubContainer>
		<ActivePlayers {activeScores} />
	</SubContainer>
</GameContainer>

<style global>
	.growing {
		background-color: rgb(255, 173, 22) !important;
	}
</style>
