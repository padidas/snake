import { writable } from 'svelte/store'

export const username = writable('')
// export const username = writable(window.localStorage.getItem('username') ?? '')
