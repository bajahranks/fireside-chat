'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signUp } from '../firebase_setup'
import { useRouter } from 'next/navigation'
import styles from './SignUp.module.css'

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signUpError, setSignUpError] = useState('')

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await signUp(username, email, password)

    setUsername('')
    setEmail('')
    setPassword('')

    console.log('Is authenticated: ' + res.email)

    if (res.email) router.replace('/profile')
    if (res.error) setSignUpError('Error Signing up: ' + res.error)
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <span className={styles.title}>Sign Up</span>
        <div>
          {signUpError ? <div className={styles.error}>{signUpError}</div> : null}
          <form onSubmit={handleSubmit}>
            <input
              type={'text'}
              name={'username'}
              value={username}
              placeholder={'Your username'}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type={'email'}
              name={'email'}
              value={email}
              placeholder={'Your Email'}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type={'password'}
              name={'password'}
              value={password}
              placeholder={'Your Password'}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type={'submit'}>Submit</button>
          </form>
          <p>
            already registered? <Link href={'/login'}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp