import React, { useState } from 'react'
import './styles.css';
import Input from '../Input';
import Button from '../Button'; 
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { auth, db, provider} from '../../firebase';
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';



const SignupSigninComponent = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [loginForm, setLoginForm] = useState(false)
  const navigate = useNavigate()

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
          navigate("/dashboard")
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

  function loginUsingEmail(){
    setLoading(true)
    console.log(email)
    console.log(password)

    if(email!="" && password!=""){

      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        toast.success("User Logged In!")
        console.log("User logged in", user)
        setLoading(false)
        navigate("/dashboard")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage)
        setLoading(false)
      });
    }else{
      toast.error("All fields are mandatory!")
      setLoading(false)
    }
  }

  async function createDoc(user){
    //make sure that doc with the uid doesn't exist
    //create a doc
    setLoading(true)
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()){
      try{
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc created!")
        setLoading(false)
      }catch(e){
        toast.error(e.message)
        setLoading(false)
      }
    }else{
      toast.error("Doc already exists!")
      setLoading(false)
    }
  }

  function googleAuth(){
    setLoading(true)
    try{

      signInWithPopup(auth, provider)
      .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      createDoc(user)
      console.log("user>>", user)
      toast.success("User Authenticated!")
      setLoading(false)
      navigate("/dashboard")
      // IdP data available using getAdditionalUserInfo(result)
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage)
        setLoading(false)
      });
    }catch(e){
      toast.error(e.message)
      setLoading(false)
    }
  }

  return (
    <>
      {loginForm ? 
        <div className='signup-wrapper'>
          <h2 className='title'>
            Login on <span style={{color: "var(--theme)"}}>FinFlow.</span> 
          </h2>

          <form>
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

            <Button 
              disabled={loading} 
              text={loading ? "Loading...": "Login Using Email and Password"} 
              onClick={loginUsingEmail}
            />
            <p className='p-login'>or</p>
            <Button 
              onClick={googleAuth}
              text={loading ? "Loading...": "Login Using Google"} 
              blue={true}
            />
            <p 
              className='p-login' 
              style={{cursor: 'pointer'}}
              onClick={()=>setLoginForm(!loginForm)}
            >
              Or Don't Have an Account Already? Click Here
            </p>
          </form>
        </div> :  
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
            <p className='p-login'>or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading...": "Signup Using Google"} 
              blue={true}
            />
            <p 
              className='p-login'
              style={{cursor: 'pointer'}}
              onClick={()=>setLoginForm(!loginForm)}
            >
              Or Have an Account Already? Click Here
            </p>
          </form>
        </div>
      }
     
    </>
  )
}

export default SignupSigninComponent
