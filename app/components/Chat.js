'use client'

import Image from 'next/image'
import Cam from '../../public/img/cam.png'
import Add from '../../public/img/add.png'
import More from '../../public/img/more.png'
import Messages from '@/app/components/Messages'
import Input from '@/app/components/Input'
import styles from './Chat.module.css'

const Chat = ({currentUser, friend}) => {

  return (
    <div className={styles.chat}>
      <div className={styles.chatInfo}>
        <span>{friend.user.displayName}</span>
        <div className={styles.chatIcons}>
          <Image className={styles.chatIcon} src={Cam} alt={''}  priority />
          <Image className={styles.chatIcon} src={Add} alt={''}  />
          <Image className={styles.chatIcon} src={More} alt={''}  />
        </div>
      </div>
      <Messages user={currentUser} data={friend} />
      <Input user={currentUser} data={friend} />
    </div>
  )
}

export default Chat
