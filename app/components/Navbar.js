import styles from './Navbar.module.css'

const Navbar = ({user}) => {
  return (
    <div className={styles.navbar}>
      <span className={styles.navbarLogo}>Fireside Chat</span>
      <div className={styles.navbarUser}>
        <img src={user?.photoURL} alt="" />
        <span>{user?.displayName}dsds</span>
        <button onClick={()=>signOut(auth)}>logout</button>
      </div>
    </div>
  )
}

export default Navbar
