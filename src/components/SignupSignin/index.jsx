import React, { useState } from 'react'
import './styles.css';
import Input from '../Input';
import Button from '../Button';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase';


const SignupSigninComponent = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  function signupWithEmail() {
    setLoading(true)
    console.log(name)
    console.log(email)
    console.log(password)
    console.log(confirmPassword)

    //Authenticate the user or create the new account usign email and password
    if(name!="" && email!="" && password!="" && confirmPassword!=""){
      if(password === confirmPassword){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          console.log("User>>", user)
          toast.success("User created");
          setLoading(false)
          setName("")
          setEmail("")
          setPassword("")
          setConfirmPassword("")
          createDoc(user)
          //Create a doc with user id as the following id
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage)
          setLoading(false)
          // ..
        });
      }else{
        toast.error("Password and Confirm password don't match")
        setLoading(false)
      }
    }else{
      toast.error("All fields are mandatory!")
      setLoading(false)
    }

  }

  function createDoc(user){
    //make sure that doc with the uid doesn't exist
    //create a doc
  }

  return (
    <div className='signup-wrapper'>
      <h2 className='title'>
        Sign Up on <span style={{color: "var(--theme)"}}>FinFlow.</span> 
      </h2>

      <form>
        <Input 
          type = 'text'
          label={"Full Name"}
          state={name}
          setState={setName}
          placeholder={"John Doe"} 
        />

        <Input 
          type = 'email'
          label={"Email"}
          state={email}
          setState={setEmail} 
          placeholder={"johndoe@gmail.com"} 
        />

        <Input 
          type = 'password'
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder={"Example@123"} 
        />

        <Input 
          type = 'password'
          label={"Confirm Password"}
          state={confirmPassword}
          setState={setConfirmPassword}
          placeholder={"Example@123"} 
        />

        <Button 
          disabled={loading} 
          text={loading ? "Loading...": "Signup Using Email and Password"} 
          onClick={signupWithEmail}
        />
        <p style={{textAlign: 'center', margin: 0}}>or</p>
        <Button 
          text={loading ? "Loading...": "Signup Using Google"} 
          blue={true}
        />
      </form>
    </div>
  )
}

export default SignupSigninComponent
