import Link from 'next/link'
import styles from '@/app/page.module.css'
import { Button } from '@nextui-org/button'
import Image from 'next/image'

const Home = () => {
  return (
    <>
      <div className={styles.main}>
        <h1>Welcome to Fireside Chat!</h1>
        <div className={styles.imgcontainer}>
          <Image
            className={styles.img}
            src={'/img/flame.png'}
            alt={'flame'}
            width={300}
            height={200}
          />
        </div>
        <div className={styles.content}>
          <h1>Welcome to Fireside Chat!</h1>
          <section className={styles.hero}>
            <p>
              Fireside Chat is a place to connect with friends and family, share ideas,
              and have meaningful conversations.
            </p>
          </section>
          <div className={styles.interact}>
            <Button className={styles.Button}>
              <Link href={'/signup'}>Sign Up</Link>
            </Button>
            <p>or</p>
            <Button className={styles.Button}>
              <Link href={'/login'}>Log In</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home