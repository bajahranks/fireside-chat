'use client'

import { useEffect, useReducer, useState } from 'react'
import Sidebar from '@/app/components/Sidebar'
import Chat from '@/app/components/Chat'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/app/firebase_setup'

const ChatPage = () => {
  const [currentUser, setCurrentUser] = useState({})

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
  }, [])

  const INITIAL_STATE = {
    chatId: 'null',
    user: {}
  }

  const chatReducer = (state, action) => {
    switch (action?.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid
        }

      default:
        return state
    }
  }


  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)

  return (
    <>
      <Sidebar currentUser={currentUser} dispatch={dispatch}/>
      <Chat currentUser={currentUser} friend={state} />
    </>
  )
}

export default ChatPage
