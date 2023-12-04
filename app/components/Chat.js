'use client'

import { useEffect, useState, useReducer } from 'react'
import Image from 'next/image'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase_setup'
import Cam from '../../public/img/cam.png'
import Add from '../../public/img/add.png'
import More from '../../public/img/more.png'
import Messages from '@/app/components/Messages'
import Input from '@/app/components/Input'
import styles from './Chat.module.css'

const Chat = () => {
  const [currentUser, setCurrentUser] = useState({})

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
  }, [])

  const INITIAL_STATE = {
    chatId: "null",
    user: {}
  }

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid
        }

      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)

  return (
    <div className={styles.chat}>
      <div className={styles.chatInfo}>
        <span>bajahranks</span>
        <div className={styles.chatIcons}>
          <Image className={styles.chatIcon} src={Cam} alt={''}  priority />
          <Image className={styles.chatIcon} src={Add} alt={''}  />
          <Image className={styles.chatIcon} src={More} alt={''}  />
        </div>
      </div>
      <Messages user={currentUser} data={state} />
      <Input user={currentUser} data={state} />
    </div>
  )
}

export default Chat
