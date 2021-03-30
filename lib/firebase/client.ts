import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/auth'
import 'firebase/storage'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  })
}

if (process.env.NODE_ENV === "development") {
  firebase.firestore().useEmulator('localhost', 8080)
  firebase.functions().useEmulator('localhost', 5001)
  // firebase.auth().useEmulator('http://localhost:9099')
}

export default firebase
