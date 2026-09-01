import React from 'react'
import Header from '../components/Header'
import SignupSigninComponent from '../components/SignupSignin'

const Signin = () => {
  return (
    <div>
      <Header/>
      <div className='wrapper'>
        <SignupSigninComponent mode="signin"/>
      </div>
    </div>
  )
}

export default Signin
