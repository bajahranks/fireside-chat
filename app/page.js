import styles from '@/app/page.module.css'
import TopBar from '@/app/components/TopBar'

const Home = () => {
  return (
    <>
      <TopBar />
      <div className={styles.main}>
        <h1>Welcome to Fireside Chat!</h1>
      </div>
    </>
  )
}

export default Home