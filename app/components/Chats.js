'use client'

import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestore } from '../firebase_setup'
import Image from 'next/image';
import styles from './Chats.module.css'

const Chats = ({user, dispatch}) => {
  const [chats, setChats] = useState([])

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(firestore, 'userChats', user.uid), (doc) => {
        setChats(doc.data())
      })

      return () => {
        unsub()
      }
    }

    user?.uid && getChats()
  }, [user]);

  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  }

  return (
    <div>
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div
          className={styles.userChat}
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <Image src={chat[1].userInfo.photoURL} alt={''} />
          <div className={styles.userChatInfo}>
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Chats
