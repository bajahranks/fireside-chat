'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase_setup'
import Chats from '@/app/components/Chats'
import Navbar from '@/app/components/Navbar'
import styles from './Sidebar.module.css'

const Sidebar = () => {
  const [currentUser, setCurrentUser] = useState({})

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
  }, [])

  return (
    <div className={styles.sidebar}>
      <Navbar user={currentUser}/>
      {/*<Search/>*/}
      <Chats/>
    </div>
  )
}

export default Sidebar
