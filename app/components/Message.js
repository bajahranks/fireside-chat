'use client'

import { useEffect, useRef } from 'react'
import styles from './Message.module.css'
import Image from 'next/image'

const Message = ({ user, message, data}) => {
  const messageRef = useRef();

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  return (
    <div
      ref={messageRef}
      className={message?.senderId === user?.uid ? {...styles.message, ...styles.messageOwner} : styles.message}
    >
      {/*<div className={styles.messageInfo}>
        <Image
          className={styles.messageInfoImg}
          src={
            message?.senderId === user?.uid
              ? user?.photoURL
              : data.user?.photoURL
          }
          alt={''}
        />
        <span>just now</span>
      </div>*/}
      <div className={styles.messageContent}>
        <p className={styles.messageContentParagraph}>sdfsf{message.text}</p>
        {message.img && <Image className={styles.messageContentImg} src={message.img} alt="" />}
      </div>
    </div>
  )
}

export default Message
