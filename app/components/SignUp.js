'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signUp } from '../firebase_setup';

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signUpError, setSignUpError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await signUp(username, email, password)

    setEmail('')
    setPassword('')

    if (res.error) setSignUpError('Error Signing up: ' + res.error)
  }

  return (
    <>
      <h2>Sign Up</h2>
      <div>
        {signUpError ? <div>{signUpError}</div> : null}
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
    </>
    )
  }

export default SignUp