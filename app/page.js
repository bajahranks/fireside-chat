import styles from '@/app/page.module.css'
import {Button} from '@nextui-org/button';
import { Navbar } from '@nextui-org/react';

const Home = () => {
  return (
    <main className={styles.main}>
      
      <h1>Welcome to Fireside Chat!</h1>
      <section className={styles.hero}> 
        <p>
          Fireside Chat is a place to connect with friends and family, share ideas,
          and have meaningful conversations.
        </p>
      </section>
      <Button className={styles.Button}><a href="/signup" className={styles.cta}>Sign Up</a></Button>
    </main>
  );
};

export default Home;