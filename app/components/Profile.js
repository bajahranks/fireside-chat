'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase_setup'
import { logOut } from '../firebase_setup'

const Profile = () => {
  const router = useRouter()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('User:', user)
      if(!user) router.replace('/login')
    })

  }, [])

  const handleLogout = async () => await logOut()

  return (
    <>
      <h1>Profile</h1>
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}

export default Profile