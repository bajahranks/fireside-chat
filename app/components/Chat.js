'use client'

import Cam from '../img/cam.png'
import Add from '../img/add.png'
import More from '../img/more.png'
import Messages from '@/app/components/Messages';
import Input from '@/app/components/Input';

const Chat = () => {
  return (
    <div style={styles.chat}>
      <div style={styles.chatInfo}>
        <span>bajahranks</span>
        <div className={styles.chatIcons}>
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <Messages />
      <Input/>
    </div>
  )
}

const styles = {
  chat: { flex: 1},
  chatInfo: {}
}

export default Chat
