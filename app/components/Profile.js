'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase_setup'
import { logOut } from '../firebase_setup'
import SignIn from '@/app/components/SignIn'

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
        ? <>
            <h1>Profile</h1>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
          </>
        : <SignIn />
      }
    </>
  )
}

export default Profile