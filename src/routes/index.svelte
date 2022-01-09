<script lang="ts">
	import Apple from '../components/Apple.svelte';
	import Controls from '../components/Controls.svelte';
	import EmptySquare from '../components/EmptySquare.svelte';
	import RestartButton from '../components/RestartButton.svelte';
	import ScoreSection from '../components/ScoreSection.svelte';
	import SnakeBody from '../components/SnakeBody.svelte';
	import SnakeHead from '../components/SnakeHead.svelte';
	import SquareContainer from '../components/SquareContainer.svelte';
	import SubContainer from '../components/Layout/SubContainer.svelte';
	import GameContainer from '../components/Layout/GameContainer.svelte';
	import GameBoard from '../components/GameBoard.svelte';
	import { browser } from '$app/env';

	// types
	type Square = [number, number];
	type SnakeBody = Array<Square>;
	type Direction = 'up' | 'down' | 'left' | 'right';
	type Highscore = {
		username: string;
		score: number;
	};
	type HeadRotation = '0deg' | '90deg' | '180deg' | '270deg';

	// states
	let squares: Array<Square> = [];
	let snakeHead: Square;
	let snakeBody: SnakeBody;
	let food: Square;
	let gameOver = false;
	let direction: Direction = 'right';
	let growing: boolean = false;
	let nowGrow: boolean = false;
	let lastFoodPos: Square;
	let score = 0;
	let username = browser ? window.localStorage.getItem('username') : '';
	let highscore: Highscore = {
		username: browser ? window.localStorage.getItem('highscore.username') : '',
		score: browser ? +window.localStorage.getItem('highscore.score') : 0
	};
	let nextBodyPartPos: Square;
	let snakeBodyWithoutFirst: SnakeBody;
	let headRotation: HeadRotation;

	// constants
	const squaresMax = 14;
	const initialSnakeHead: Square = [4, 3];
	const initialSnakeBody: SnakeBody = [[4, 2]];

	snakeHead = initialSnakeHead;
	snakeBody = initialSnakeBody;
	nextBodyPartPos = snakeHead;
	food = [8, 6];

	$: if (food[0] == snakeHead[0] && food[1] == snakeHead[1]) {
		console.log('eating..');
		score = score + 1;
		if (score > highscore.score) {
			highscore.score = score;
			highscore.username = username;
			localStorage.setItem('highscore.score', score.toString());
			localStorage.setItem('highscore.username', username);
		}
		resetFood();
		growing = true;
		console.log('growing = true');
	}

	$: if (growing == true) {
		let lastSnakeBodyPart = snakeBody[snakeBody.length - 1];
		if (nowGrow == true) {
			grow();
			growing = false;
			console.log('growing = false');
			nowGrow = false;
			console.log('nowGrow = false');
		}
		if (lastSnakeBodyPart[0] === lastFoodPos[0] && lastSnakeBodyPart[1] === lastFoodPos[1]) {
			nowGrow = true;
			console.log('nowGrow = true');
		}
	}

	const grow = () => {
		snakeBody = [...snakeBody, lastFoodPos];
		console.log('growing..');
	};

	const resetFood = () => {
		lastFoodPos = food;
		do {
			food = [Math.floor(Math.random() * squaresMax), Math.floor(Math.random() * squaresMax)];
		} while (snakeBody.some((elem) => elem[0] === food[0] && elem[1] === food[1]));
	};

	const initGameBoard = () => {
		for (let i = 0; i < squaresMax; i++) {
			for (let j = 0; j < squaresMax; j++) {
				squares.push([i, j]);
			}
		}
	};
	initGameBoard();

	$: snakeBodyWithoutFirst = snakeBody.filter((_, i) => i !== 0);

	// collision detection (body)
	$: if (
		snakeBodyWithoutFirst.some((elem) => elem[0] === snakeHead[0] && elem[1] === snakeHead[1])
	) {
		console.log('COLLISION WITH SNAKE BODY');
		gameOver = true;
	}

	// collision detection (wall)
	$: if (
		snakeHead[0] >= squaresMax ||
		snakeHead[0] < 0 ||
		snakeHead[1] >= squaresMax ||
		snakeHead[1] < 0
	) {
		console.log('COLLISION WITH WALL');
		gameOver = true;
	}

	// let snakeHead move in an interval
	const ms = 100;
	let clear: any;
	$: {
		clearInterval(clear);
		clear = setInterval(moveSnakeHead, ms);
	}

	const moveSnakeHead = () => {
		if (gameOver) return;
		switch (direction) {
			case 'up':
				snakeHead = [snakeHead[0] - 1, snakeHead[1]];
				break;
			case 'down':
				snakeHead = [snakeHead[0] + 1, snakeHead[1]];
				break;
			case 'left':
				snakeHead = [snakeHead[0], snakeHead[1] - 1];
				break;
			case 'right':
				snakeHead = [snakeHead[0], snakeHead[1] + 1];
				break;
			default:
				break;
		}
	};

	// logging
	$: {
		console.log('');
		console.log('|´´´´´´´´´´´´´´´´´´´´´´´´´´´´´´|');
		console.log('snakeBody', snakeBody);
		console.log('snakeHead', snakeHead);
		console.log('direction', direction);
		console.log('food', food);
		console.log('lastFoodPos', lastFoodPos);
		console.log('|..............................|');
		console.log('');
	}

	$: nextBodyPartPos = snakeHead;

	// move snakeBody depending on snakeHead
	$: snakeBody = snakeBody?.map((elem) => {
		snakeHead; // this line is only for reactivity
		let newPos = nextBodyPartPos;
		nextBodyPartPos = elem;
		return newPos;
	});

	const restart = () => {
		snakeHead = initialSnakeHead;
		snakeBody = initialSnakeBody;
		direction = 'right';
		gameOver = false;
		score = 0;
	};

	// snakeHead rotation
	$: switch (direction) {
		case 'up':
			headRotation = '0deg';
			break;
		case 'down':
			headRotation = '180deg';
			break;
		case 'left':
			headRotation = '270deg';
			break;
		case 'right':
			headRotation = '90deg';
			break;
		default:
			break;
	}

	// controlls & key events
	const handleKeydown = (e) => {
		if (e.code === 'ArrowDown') e.preventDefault();
		if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'KeyI') goUp();
		else if (e.code === 'ArrowDown' || e.code === 'KeyS' || e.code === 'KeyK') goDown();
		else if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyJ') goLeft();
		else if (e.code === 'ArrowRight' || e.code === 'KeyD' || e.code === 'KeyL') goRight();
	};

	const goUp = () => {
		if (direction !== 'down') direction = 'up';
	};

	const goDown = () => {
		if (direction !== 'up') direction = 'down';
	};

	const goLeft = () => {
		if (direction !== 'right') direction = 'left';
	};

	const goRight = () => {
		if (direction !== 'left') direction = 'right';
	};

	const rotateRight = () => {
		if (direction === 'left') direction = 'up';
		else if (direction === 'up') direction = 'right';
		else if (direction === 'right') direction = 'down';
		else if (direction === 'down') direction = 'left';
	};

	const rotateLeft = () => {
		if (direction === 'left') direction = 'down';
		else if (direction === 'down') direction = 'right';
		else if (direction === 'right') direction = 'up';
		else if (direction === 'up') direction = 'left';
	};
</script>

<svelte:window on:keydown|={handleKeydown} />

<GameContainer>
	<SubContainer>
		<div class="flex w-[344px] justify-between items-center mb-2">
			<ScoreSection {username} {score} {highscore} />
		</div>
		<GameBoard {gameOver}>
			{#if gameOver}
				<RestartButton {restart} />
			{/if}
			{#each squares as square}
				<SquareContainer>
					{#if snakeBody.some((box) => box[0] == square[0] && box[1] == square[1])}
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
