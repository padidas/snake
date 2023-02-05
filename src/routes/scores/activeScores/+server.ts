import { json } from '@sveltejs/kit'
import { getActivePlayers } from 'src/lib/database'

// GET activePlayers
export async function GET(): Promise<Response> {
	const activePlayers = await getActivePlayers()

	return json(activePlayers)
}
