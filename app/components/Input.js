'use client'

import { useState } from 'react'
import { firestore } from '../firebase_setup'
import { v4 as uuid } from 'uuid'
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc
} from 'firebase/firestore'
import styles from './Input.module.css'

const Input = ({user, data}) => {
  const [text, setText] = useState('')

  const handleSend = async () => {
    await updateDoc(doc(firestore, 'chats', data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: user.uid,
        date: Timestamp.now()
      })
    })

    await updateDoc(doc(firestore, 'userChats', user.uid), {
      [data.chatId + '.lastMessage']: {text},
      [data.chatId + '.date']: serverTimestamp()
    })

    await updateDoc(doc(firestore, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {text},
      [data.chatId + '.date']: serverTimestamp()
    })

    setText('')
  }

  return (
    <div className={styles.input}>
      <input
        type={'text'}
        placeholder={'Type something...'}
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className={styles.send}>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input
