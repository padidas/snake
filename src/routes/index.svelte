<script lang="ts">
	import {
		INITIAL_SNAKE_HEAD,
		INITIAL_SNAKE_BODY,
		snakeHead,
		snakeBody,
		lastSnakeBodyPart,
		snakeBodyWithoutFirst,
	} from '../stores/SnakeStore'
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
	let food: Square = [8, 6]
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
	let headRotation: HeadRotation
	let gameOverKeydownCount = 0
	let apple = '/assets/apple.svg'
	let banana = '/assets/banana.svg'
	let avocado = '/assets/avocado.svg'
	let appleOrBanana = 0
	let rotationQueue: Direction[] = []

	// constants //
	const SQUARES_MAX = 14
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
	const SNAKE_SPEED_IN_MS = 100
	const GET_SCORES_INTERVAL_IN_MS = 3000

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

	// eating
	$: if (food[0] == $snakeHead[0] && food[1] == $snakeHead[1]) {
		score = score + 1
		growPos = food
		resetFood()
		growing = true
		saveNewScore()
	}

	const grow = () => {
		snakeBody.update(sb => [...sb, growPos])
		growing = false
	}

	const resetFood = () => {
		lastFoodPos = food
		appleOrBanana = Math.floor(Math.random() * 3)
		do {
			food = [Math.floor(Math.random() * SQUARES_MAX), Math.floor(Math.random() * SQUARES_MAX)]
		} while ($snakeBody.some(elem => elem[0] === food[0] && elem[1] === food[1]))
	}

	const initGameBoard = () => {
		for (let i = 0; i < SQUARES_MAX; i++) {
			for (let j = 0; j < SQUARES_MAX; j++) {
				squares.push([i, j])
			}
		}
	}
	initGameBoard()

	// collision detection (body)
	$: if (
		$snakeBodyWithoutFirst.some(elem => elem[0] === $snakeHead[0] && elem[1] === $snakeHead[1])
	) {
		console.log('COLLISION WITH SNAKE BODY')
		gameOver = true
	}

	// allow snake to go through walls
	$: {
		if ($snakeHead[0] >= SQUARES_MAX) snakeHead.update(sh => [0, sh[1]])
		if ($snakeHead[0] < 0) snakeHead.update(sh => [SQUARES_MAX - 1, sh[1]])
		if ($snakeHead[1] >= SQUARES_MAX) snakeHead.update(sh => [sh[0], 0])
		if ($snakeHead[1] < 0) snakeHead.update(sh => [sh[0], SQUARES_MAX - 1])
	}

	const moveSnakeHead = () => {
		if (gameOver) return
		direction = rotationQueue[0] ?? direction
		rotationQueue = rotationQueue.filter((elem, i) => i != 0)

		switch (direction) {
			case 'up':
				snakeHead.update(sh => [sh[0] - 1, sh[1]])
				break
			case 'down':
				snakeHead.update(sh => [sh[0] + 1, sh[1]])
				break
			case 'left':
				snakeHead.update(sh => [sh[0], sh[1] - 1])
				break
			case 'right':
				snakeHead.update(sh => [sh[0], sh[1] + 1])
				break
			default:
				break
		}

		if (growing == true) {
			if ($lastSnakeBodyPart[0] === growPos[0] && $lastSnakeBodyPart[1] === growPos[1]) grow()
		}
	}

	$: nextBodyPartPos = $snakeHead

	// move snakeBody depending on snakeHead
	$: snakeBody.update(sb =>
		sb?.map(elem => {
			$snakeHead // this line is only for reactivity
			let newPos = nextBodyPartPos
			nextBodyPartPos = elem
			return newPos
		}),
	)

	const restart = () => {
		snakeHead.set(INITIAL_SNAKE_HEAD)
		snakeBody.set(INITIAL_SNAKE_BODY)
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
			snakeLength: $snakeBody.length,
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
		const key = e.code
		if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'ArrowLeft' || key === 'ArrowRight')
			e.preventDefault()

		if (gameOver) {
			restartGameOnKeydownIfGameOver()
			return
		}

		if (key === 'ArrowUp' || key === 'KeyW' || key === 'KeyI') goUp()
		else if (key === 'ArrowDown' || key === 'KeyS' || key === 'KeyK') goDown()
		else if (key === 'ArrowLeft' || key === 'KeyA' || key === 'KeyJ') goLeft()
		else if (key === 'ArrowRight' || key === 'KeyD' || key === 'KeyL') goRight()
	}

	const goUp = () => {
		if (direction === 'down' || rotationQueue.includes('up')) return
		else rotationQueue = [...rotationQueue, 'up']
	}

	const goDown = () => {
		if (direction === 'up' || rotationQueue.includes('down')) return
		else rotationQueue = [...rotationQueue, 'down']
	}

	const goLeft = () => {
		if (direction === 'right' || rotationQueue.includes('left')) return
		else rotationQueue = [...rotationQueue, 'left']
	}

	const goRight = () => {
		if (direction === 'left' || rotationQueue.includes('right')) return
		else rotationQueue = [...rotationQueue, 'right']
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
					{#if $snakeHead[0] == square[0] && $snakeHead[1] == square[1]}
						<SnakeHead {headRotation} {growing} />
					{:else if $snakeBody.some(box => box[0] == square[0] && box[1] == square[1])}
						<SnakeBody {growing} />
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
		<div class="flex w-[336px] h-[40px] justify-between items-center">
			<SnakeLengthInfo snakeLengthInfo={$snakeBody.length} />
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
