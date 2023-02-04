import { json } from '@sveltejs/kit'
import { getTop10Players } from 'src/lib/database'

export async function GET(): Promise<Response> {
	const topPlayers = await getTop10Players()

	return json(topPlayers)
}
