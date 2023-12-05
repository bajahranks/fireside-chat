import styles from '@/app/page.module.css'
import {Button} from '@nextui-org/button';
import { Navbar } from '@nextui-org/react';
import Image from 'next/image';

const Home = () => {
  return (
  <>
    <header className={styles.header}>
        <Navbar brand="Fireside Chat"> FIRESIDE IS CURRENTLY UNDER CONSTRUCTION, PLEASE VISIT AGAIN SOON! </Navbar>
    </header>
    <main className={styles.main}>
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
    </main>
  </> )
};

export default Home;