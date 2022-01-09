// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore/lite'
import type { Score } from './model/Types'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import { firebaseConfig } from './firebaseConfig'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// get highscore
export const getScores = async (): Promise<Score> => {
	const scoresCollection = collection(db, 'scores')
	const scoresSnapshot = await getDocs(scoresCollection)
	const scoresList = scoresSnapshot.docs.map(doc => doc.data())
	const highscore = scoresList.reduce((a, b) => {
		if (a.score > b.score) return a
		else return b
	})
	return {
		username: highscore.username,
		score: highscore.score,
	}
}

export const saveScore = async (newScore: Score): Promise<void> => {
	await setDoc(doc(db, 'scores', `id:${newScore.username}-${newScore.score}`), newScore)
}
