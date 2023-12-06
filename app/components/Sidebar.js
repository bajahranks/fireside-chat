'use client'

import Chats from '@/app/components/Chats'
import Navbar from '@/app/components/Navbar'
import styles from './Sidebar.module.css'
import Search from '@/app/components/Search';

const Sidebar = ({currentUser, dispatch}) => {
  console.log('sidebar user: ' + currentUser?.displayName)
  return (
    <div className={styles.sidebar}>
      <Navbar user={currentUser} />
      <Search user={currentUser} />
      <Chats user={currentUser} dispatch={dispatch} />
    </div>
  )
}

export default Sidebar
