<script lang="ts">
	import {
		postCurrentScore,
		incrementCurrentScore,
		resetCurrentScore,
		resetCurrentScoreId,
		snakeLength,
	} from '../stores/ScoreStore'
	import { fruitIcons, appleOrBanana, food, resetFood } from '../stores/FoodStore'
	import { username } from '../stores'

	import GameBoardTile from '../components/GameBoardTile.svelte'
	import RestartButton from '../components/RestartButton.svelte'
	import ScoreSection from '../components/ScoreSection.svelte'
	import SnakeBody from '../components/SnakeBody.svelte'
	import SnakeHead from '../components/SnakeHead.svelte'
	import SquareContainer from '../components/SquareContainer.svelte'
	import SubContainer from '../components/Layout/SubContainer.svelte'
	import GameContainer from '../components/Layout/GameContainer.svelte'
	import GameBoard from '../components/GameBoard.svelte'
	import GameOverText from '../components/GameOverText.svelte'
	import SnakeLengthInfo from '../components/SnakeLengthInfo.svelte'
	import ActivePlayers from '../components/ActivePlayers.svelte'
	import TouchControl from '../components/TouchControl.svelte'
	import ButtonControl from '../components/ButtonControl.svelte'
	import TopPlayersBoard from '../components/TopPlayersBoard.svelte'

	import { onMount } from 'svelte'
	import { getSnakeSpeedDependingOnBrowser } from '../utils/getSnakeSpeed'
	import type { Direction, HeadRotation, Square } from '../model/Types'
	import {
		INITIAL_SNAKE_BODY,
		INITIAL_SNAKE_HEAD,
		INITIAL_SPS,
		SQUARES_MAX,
	} from '../model/Constants'
	import EnterNamePopover from '../components/EnterNamePopover.svelte'

	// states //
	let gameBoard: Array<Square> = []
	let snakeHead: Square
	let snakeBody: Square[]
	let gameOver = false
	let enterNamePopoverVisible = false
	let direction: Direction = 'right'
	let growing: boolean = false
	let growPos: Square
	let nextBodyPartPos: Square
	let snakeBodyWithoutFirst: Square[]
	let lastSnakeBodyPart: Square
	let headRotation: HeadRotation
	let gameOverKeydownCount = 0
	let rotationQueue: Direction[] = []
	let shouldUseSwipeControl: boolean = false
	let coveredTiles = 0
	let squaresPerSecond: number
	let spsCalculationInterval: NodeJS.Timer
	let snakeHeadMoveInterval: NodeJS.Timer

	// initialization //
	snakeHead = INITIAL_SNAKE_HEAD
	snakeBody = INITIAL_SNAKE_BODY
	nextBodyPartPos = INITIAL_SNAKE_HEAD
	squaresPerSecond = INITIAL_SPS

	onMount(() => {
		initSnakeHeadMoveInterval()
		initSpsCalculationInterval()
	})

	const initSnakeHeadMoveInterval = () =>
		(snakeHeadMoveInterval = setInterval(moveSnakeHead, getSnakeSpeedDependingOnBrowser()))

	const initSpsCalculationInterval = () =>
		(spsCalculationInterval = setInterval(calculateSps, 5_000))

	const calculateSps = () => {
		squaresPerSecond = coveredTiles / 5
		coveredTiles = 0
	}

	$: if (gameOver) {
		squaresPerSecond = 0
		coveredTiles = 0
		clearInterval(snakeHeadMoveInterval)
		clearInterval(spsCalculationInterval)
	}

	$: lastSnakeBodyPart = snakeBody[snakeBody.length - 1]

	// eating
	$: if ($food[0] == snakeHead[0] && $food[1] == snakeHead[1]) {
		incrementCurrentScore()
		growPos = $food
		resetFood(snakeBody)
		growing = true
		postCurrentScore()
	}

	const grow = () => {
		snakeBody = [...snakeBody, growPos]
		growing = false
	}

	const initGameBoard = () => {
		for (let i = 0; i < SQUARES_MAX; i++) {
			for (let j = 0; j < SQUARES_MAX; j++) {
				gameBoard.push([i, j])
			}
		}
	}
	initGameBoard()

	$: snakeLength.set(snakeBody.length)

	$: snakeBodyWithoutFirst = snakeBody.filter((_, i) => i !== 0)

	// collision detection (body)
	$: if (snakeBodyWithoutFirst.some(elem => elem[0] === snakeHead[0] && elem[1] === snakeHead[1])) {
		console.log('COLLISION WITH SNAKE BODY')
		gameOver = true
	}

	// allow snake to go through walls
	$: {
		if (snakeHead[0] >= SQUARES_MAX) snakeHead[0] = 0
		else if (snakeHead[0] < 0) snakeHead[0] = SQUARES_MAX - 1
		else if (snakeHead[1] >= SQUARES_MAX) snakeHead[1] = 0
		else if (snakeHead[1] < 0) snakeHead[1] = SQUARES_MAX - 1
	}

	// show popover to enter username before starting
	$: {
		if (!$username) enterNamePopoverVisible = true
	}

	const closeEnterNamePopover = () => {
		if ($username) enterNamePopoverVisible = false
	}

	const moveSnakeHead = () => {
		if (!$username || enterNamePopoverVisible) return

		coveredTiles = coveredTiles + 1

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
		resetCurrentScore()
		resetCurrentScoreId()
		growing = false
		initSnakeHeadMoveInterval()
		initSpsCalculationInterval()
		squaresPerSecond = INITIAL_SPS
	}

	const toggleControlMode = () => (shouldUseSwipeControl = !shouldUseSwipeControl)

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

	// controls & key events
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
		<ScoreSection />
		<GameBoard>
			{#if gameOver}
				<GameOverText />
			{/if}
			{#if enterNamePopoverVisible}
				<EnterNamePopover onClickFunction={closeEnterNamePopover} username={$username} />
			{/if}
			{#each gameBoard as square}
				<SquareContainer>
					{#if snakeBody.some(snakeBodyPart => snakeBodyPart[0] == square[0] && snakeBodyPart[1] == square[1])}
						<SnakeBody {growing} />
					{:else if snakeHead[0] == square[0] && snakeHead[1] == square[1]}
						<SnakeHead {headRotation} {growing} />
					{:else if $food[0] == square[0] && $food[1] == square[1]}
						<GameBoardTile {square}>
							<img src={fruitIcons[$appleOrBanana]} alt="fruit icon" />
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
			<SnakeLengthInfo />
			<div class="text-xs">{`[${squaresPerSecond} SPS]`}</div>
			<RestartButton {restart} />
		</div>
	</SubContainer>
	{#if shouldUseSwipeControl}
		<TouchControl {rotateSnake} />
	{:else}
		<ButtonControl {rotateSnake} />
	{/if}
	<SubContainer>
		<TopPlayersBoard />
	</SubContainer>
	<SubContainer>
		<ActivePlayers />
	</SubContainer>
</GameContainer>
