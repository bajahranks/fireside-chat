'use client'

import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestore } from '../firebase_setup'
import styles from './Messages.module.css'
import Message from '@/app/components/Message'

const Messages = ({ user, data }) => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const unSub = onSnapshot(doc(firestore, 'chats', data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages)
    })

    return () => {
      unSub()
    }
  }, [data.chatId])

  console.log(messages)
  return (
    <div className={styles.messages}>
      {messages.map((message) => (
        <Message key={message.id} user={user} message={message} data={data} />
      ))}
    </div>


  )
}

export default Messages
