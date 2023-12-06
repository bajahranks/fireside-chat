import styles from '@/app/page.module.css'
import {Button} from '@nextui-org/button';
import Image from 'next/image';

const Home = () => {
  return (
    <>
      <TopBar />
      <div className={styles.main}>
    <div className={styles.imgcontainer}>
    <Image
        className={styles.img}
        src="/img/flame.png"
        alt="flame"
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
              <a href="/signup">Sign Up</a>
            </Button>
            <p>or</p>
            <Button className={styles.Button}>
              <a href="/login">Log In</a>
            </Button>
          </div>
      </div>
      </div>
    </>
    )
};

export default Home;