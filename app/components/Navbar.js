import styles from './Navbar.module.css'

const Navbar = ({user}) => {
  return (
    <div className={styles.navbar}>
      <span className={styles.navbarLogo}>Fireside Chat</span>
      <div className={styles.navbarUser}>
        <span>{user?.email}</span>
      </div>
    </div>
  )
}

export default Navbar
