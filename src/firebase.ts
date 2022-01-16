// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import type { Score } from './model/Types'
import { getFirestore, setDoc, doc, Timestamp } from 'firebase/firestore'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import { firebaseConfig } from './firebaseConfig'

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize AppCheck
const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider('6LdlfxgeAAAAANVY24dztqNiaQ7msGl7FtdN4zcK'),

	// Optional argument. If true, the SDK automatically refreshes App Check
	// tokens as needed.
	isTokenAutoRefreshEnabled: true,
})

export const db = getFirestore(app)

export const saveScore = async (scoreId = 'dede', newScore: Score): Promise<void> => {
	try {
		await setDoc(doc(db, 'scores', scoreId), { ...newScore, created: Timestamp.now() })
	} catch (err) {
		alert(err)
	}
}
