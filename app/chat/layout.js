import styles from '@/app/chat/page.module.css'

const ChatLayout = ({ children }) => {
  return (
    <>
      <div className={styles.home}>
        <div className={styles.container}>
          { children }
        </div>
      </div>
    </>
  )
}

export default ChatLayout
