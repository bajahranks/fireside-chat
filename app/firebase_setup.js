import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBnPa5LmKXKQDEt6bA1dx2qP36wJHTDrIQ',
  authDomain: 'fireside-chat-32ae9.firebaseapp.com',
  projectId: 'fireside-chat-32ae9',
  storageBucket: 'fireside-chat-32ae9.appspot.com',
  messagingSenderId: '1073641899258',
  appId: '1:1073641899258:web:6ad14486e11a635faab543'
}

const app = initializeApp(firebaseConfig)

export const firestore = getFirestore(app)
export const auth = getAuth(app)