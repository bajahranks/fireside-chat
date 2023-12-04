import { VideoWrapper } from '@/app/components/VideoWrapper';
import styles from '@/app/video/page.module.css';

const Video = () => {
  return (
    <div className={styles.videoWrapper}>
      <h1>Welcome to Fireside Chat Video!</h1>
      <VideoWrapper />
    </div>
  )
}

export default Video