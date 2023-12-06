'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase_setup'
import { logOut } from '../firebase_setup'
import SignIn from '@/app/components/SignIn'
import TopBar from '@/app/components/TopBar'
import styles from './Profile.module.css'

const Profile = () => {
  const [user, setUser] = useState({})
  //const router = useRouter()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user)
      console.log('User:', user?.email)
    })

  }, [])

  const handleLogout = async () => await logOut()

  return (
    <>
      {user
        ? <div className={styles.container}>
            <h1 className={styles.header}>Profile</h1>
            <p>Display Name: {user.displayName}</p>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        : <SignIn />
      }
    </>
  )
}

export default Profile