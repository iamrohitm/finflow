import React, { useState } from 'react'
import './styles.css';
import Input from '../Input';
import Button from '../Button'; 
import { toast } from 'sonner';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { auth, db, provider} from '../../firebase';
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';



const SignupSigninComponent = ({ mode = 'signup' }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
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
          toast.success("Account Created Successfully!")
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
        toast.success("Logged In Successfully!")
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
        toast.success("Account Created Successfully!")
        setLoading(false)
      }catch(e){
        toast.error(e.message)
        setLoading(false)
      }
    }else{
      // toast.error("Doc already exists!")
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
      toast.success("Logged In Successfully!")
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
      {mode === 'signin' ? 
        <div className='signup-wrapper'>
          <h2 className='title'>
            Sign In to <span style={{color: "var(--theme)"}}>FinFlow.</span> 
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
              text={loading ? "Loading...": "Sign In with Email"} 
              onClick={loginUsingEmail}
            />
            <p className='p-login'>or</p>
            <Button 
              onClick={googleAuth}
              text={loading ? "Loading...": "Sign In with Google"} 
              blue={true}
            />
            <p 
              className='p-login' 
              style={{cursor: 'pointer'}}
              onClick={()=>navigate('/signup')}
            >
              Don't have an account? Sign up here
            </p>
          </form>
        </div> :  
        <div className='signup-wrapper'>
          <h2 className='title'>
            Create Account on <span style={{color: "var(--theme)"}}>FinFlow.</span> 
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
              text={loading ? "Loading...": "Sign Up with Email"} 
              onClick={signupWithEmail}
            />
            <p className='p-login'>or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading...": "Sign Up with Google"} 
              blue={true}
            />
            <p 
              className='p-login'
              style={{cursor: 'pointer'}}
              onClick={()=>navigate('/signin')}
            >
              Already have an account? Sign in here
            </p>
          </form>
        </div>
      }
     
    </>
  )
}

export default SignupSigninComponent
