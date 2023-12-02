import styles from './page.module.css'
import { VideoWrapper } from '@/app/components/VideoWrapper';

export const metadata = {
  title: 'Fireside Chat',
  description: 'An advanced web-based communication application',
}

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Welcome to Fireside Chat!</h1>
      <VideoWrapper />
    </main>
  )
}
