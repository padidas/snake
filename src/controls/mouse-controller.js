/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class MouseController {
	host
	pos = { x: 0, y: 0 }

	_onMouseMove = ({ clientX, clientY }) => {
		this.pos = { x: clientX, y: clientY }
		this.host.requestUpdate()
	}

	constructor(host) {
		this.host = host
		host.addController(this)
	}

	hostConnected() {
		document.getElementById('joystick').addEventListener('mousemove', this._onMouseMove)
	}

	hostDisconnected() {
		document.getElementById('joystick').removeEventListener('mousemove', this._onMouseMove)
	}
}
