'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase_setup'
import { logOut } from '../firebase_setup'
import SignIn from '@/app/components/SignIn'
import TopBar from '@/app/components/TopBar'
import styles from '@/app/components/Profile.module.css'
import Image from 'next/image';

const Profile = () => {
  const [user, setUser] = useState({})
  //const router = useRouter()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user)
      console.log('User:', user?.email)
    })

  }, [])

  const handleLogout = async () => await logOut()

  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleEditProfile = async (e) => {
    e.preventDefault();

    const updateProfileInformation = async (updatedUser) => {};

    await updateProfileInformation(user);
    setEditModalOpen(false);
  };

  return (
    <>
      {user ? (
  <>
    <TopBar />
    <div className={styles.profileContainer}>
      <Image
        src={user.photoURL || '/img/default-profile-picture.png'} // Use a default picture if no photoURL is available
        alt="Profile Picture"
        width={120}
        height={100}
        className={styles.profilePicture}
      />
      <h1>
        Hello {user.displayName}! <button onClick={() => setEditModalOpen(true)} className={styles.button}>Edit Info</button>{' '}
      </h1>
      <p>Email: {user.email}</p>
      <p>Bio: {user.bio || 'No bio available'} </p>
      <button onClick={handleLogout} className={styles.button}>
        Logout
      </button>
    </div>

     {/* Edit Profile Modal */}
     {isEditModalOpen && (
      <div className={styles.modal}>
        <h2>Edit Profile</h2>
        <form onSubmit={handleEditProfile}>
          {/* form elements for editing profile information */}
          <label>
            Bio:  
            <textarea
              value={user.bio || ''}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
            />
          </label>
          <button type="submit" className={styles.button}>Save Changes</button>
          <button type="button" className={styles.button} onClick={() => setEditModalOpen(false)}>
            Cancel
          </button>
        </form>
        <button className={styles.button} onClick={() => setEditModalOpen(false)}>Close</button>
      </div>
    )}
  </>
) : (
  <SignIn /> )
      }
    </>
  )
}

export default Profile