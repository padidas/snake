import Bowser from 'bowser'

// Firefox 94 and Chrome 100 corresponds to 10 squares per second on both browsers
const FIREFOX_SNAKE_SPEED = 94
const CHROME_SNAKE_SPEED = 100

export const getSnakeSpeedDependingOnBrowser = (): number =>
	Bowser.getParser(window.navigator.userAgent).getEngineName() == 'Gecko'
		? FIREFOX_SNAKE_SPEED
		: CHROME_SNAKE_SPEED
