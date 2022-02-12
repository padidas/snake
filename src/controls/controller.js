/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { tick, onMount, beforeUpdate, afterUpdate, onDestroy } from 'svelte'
import { writable } from 'svelte/store'

class SvelteControllerHost {
	_controllers = []
	_controller
	store

	constructor(store) {
		this.store = store
	}

	addController(c) {
		this._controllers.push(c)
	}

	requestUpdate() {
		this.store.set(this._controller)
	}

	get updateComplete() {
		return tick()
	}

	connected() {
		this._controllers.forEach(c => c.hostConnected?.())
	}

	disconnected() {
		this._controllers.forEach(c => c.hostDisconnected?.())
	}

	update() {
		this._controllers.forEach(c => c.hostUpdate?.())
	}

	updated() {
		this._controllers.forEach(c => c.hostUpdated?.())
	}
}

export const makeSvelteController = factory => {
	const store = writable(undefined)
	const host = new SvelteControllerHost(store)
	const controller = factory(host)
	host._controller = controller
	store.set(controller)
	onMount(() => host.connected())
	onDestroy(() => host.disconnected())
	beforeUpdate(() => host.update())
	afterUpdate(() => host.updated())
	return store
}
