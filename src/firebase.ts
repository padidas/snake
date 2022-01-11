// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import type { Score } from './model/Types'
import { getFirestore, collection, setDoc, doc, Timestamp } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import { firebaseConfig } from './firebaseConfig'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export const saveScore = async (scoreId = 'dede', newScore: Score): Promise<void> => {
	try {
		await setDoc(doc(db, 'scores', scoreId), { ...newScore, created: Timestamp.now() })
	} catch (err) {
		alert(err)
	}
}
