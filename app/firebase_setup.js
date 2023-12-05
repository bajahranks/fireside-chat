import { initializeApp, getApps, getApp } from 'firebase/app';
import { addDoc, collection, getFirestore, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile  } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBnPa5LmKXKQDEt6bA1dx2qP36wJHTDrIQ',
  authDomain: 'fireside-chat-32ae9.firebaseapp.com',
  projectId: 'fireside-chat-32ae9',
  storageBucket: 'fireside-chat-32ae9.appspot.com',
  messagingSenderId: '1073641899258',
  appId: '1:1073641899258:web:6ad14486e11a635faab543'
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

export const firestore = getFirestore(app)
export const auth = getAuth(app)

export const signUp = async (username, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update user authentication information
    await updateProfile(user, {
      displayName: username
    })

    // Create a profile for the user
    await setDoc(doc(firestore, 'profile', user.uid), {
      uid: user.uid,
      username: username,
      email: email
    })

    // Create empty user chats
    await setDoc(doc(firestore, 'userChats', user.uid), {})

    return user
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