'use client'

import { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import styles from './Search.module.css'
import userStyles from './Chats.module.css'
import { firestore } from '@/app/firebase_setup'

const Search = ({user}) => {
  const [username, setUsername] = useState('')
  const [friend, setFriend] = useState(null)
  const [err, setErr] = useState(false)

  const handleSearch = async () => {
    const q = query(
      collection(firestore, 'profile'),
      where('username', '==', username)
    )

    try {
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        setFriend(doc.data())
      })
    } catch (err) {
      setErr(true)
    }
  }

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch()
  }

  const handleSelect = async () => {
    //check whether the chats exist, if not create
    const combinedId =
      user.uid > friend.uid
        ? user.uid + friend.uid
        : friend.uid + user.uid

    try {
      const res = await getDoc(doc(firestore, 'chats', combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(firestore, 'chats', combinedId), { messages: [] })

        //create user chats
        await updateDoc(doc(firestore, 'userChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: friend.uid,
            displayName: friend.displayName
          },
          [combinedId + '.date']: serverTimestamp()
        })

        await updateDoc(doc(firestore, 'userChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId + '.date']: serverTimestamp()
        })
      }
    } catch (err) {}

    setFriend(null)
    setUsername('')
  }

  return (
    <div className={styles.search}>
      <div className={styles.searchForm}>
        <input
          type={'text'}
          placeholder={'Find a user'}
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {friend && (
        <div className={userStyles.userChat} onClick={handleSelect}>
          <div className={userStyles.userChatInfo}>
            <span>{friend.displayName}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search