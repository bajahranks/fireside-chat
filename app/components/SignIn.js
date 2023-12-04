'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '../firebase_setup'
import Link from 'next/link'
import styles from './SignUp.module.css'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await signIn(email, password)

    setEmail("")
    setPassword("")

    console.log('Is authenticated: ' + res.email)

    if (res.email) router.replace('/profile')
    if (res.error) setLoginError(res.error)
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <span className={styles.title}>Sign In</span>
        {loginError ? <div>{loginError}</div> : null}
        <form onSubmit={handleSubmit}>
          <input
            type={'email'}
            name={'email'}
            value={email}
            placeholder={'Your Email'}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type={'password'}
            name={'password'}
            value={password}
            placeholder={'Your Password'}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type={'submit'}>Submit</button>
        </form>
        <p>
          New user? <Link href={'/signup'}>Register</Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn