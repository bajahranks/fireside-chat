import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut  } from 'firebase/auth';

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

export const signUp = async (username, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await addDoc(collection(firestore, 'profile'), {
      uid: user.uid,
      username: username
    })

    return true
  } catch (error) {
    return {error: error.message}
  }
}

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    return userCredential.user
  } catch (error) {
    return {error: error.message}
  }
}

export const logOut = async () => {
  try {
    await signOut(auth)

    return true
  } catch (error) {
    return false
  }
}