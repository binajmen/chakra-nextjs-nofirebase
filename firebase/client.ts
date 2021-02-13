import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/auth'

if (typeof window !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp({
        // TODO: use process.env.VAR instead?
        apiKey: "AIzaSyC5FUlFACUZecaqKnSzpEM0CDcSOJmb6eM",
        authDomain: "orderbru.firebaseapp.com",
        projectId: "orderbru",
        storageBucket: "orderbru.appspot.com",
        messagingSenderId: "223878564751",
        appId: "1:223878564751:web:5da2c08fba1e680a4819fa",
        measurementId: "G-ZBYEJQ4N8T"
    })

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

    if (process.env.NODE_ENV === "development") {
        firebase.firestore().useEmulator('localhost', 8080)
        firebase.functions().useEmulator('localhost', 5001)
        firebase.auth().useEmulator('localhost:9099')
    }
}

const db = firebase.firestore()
const functions = firebase.functions()
const auth = firebase.auth()

export default firebase
export { db, functions, auth }