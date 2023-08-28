import React from 'react';
import {auth,provider} from '../firebase-config';
import {signInWithPopup} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Login({ setIsAuth, isAuth }) {

  let navigate=useNavigate();

  const signInWithGoogle=()=>{
    try{
      signInWithPopup(auth,provider).then((result)=>{
      localStorage.setItem("isAuth",true);
      setIsAuth(true);
      navigate('/');
    })
  }
  catch(err)
  {
    console.error(err)
  }
  }

  useEffect(()=>{
    if(isAuth){
      navigate("/");
    }
  },[]);

  return (
    <div className='loginPage'>
        <p>Sign in With Google to Continue</p>
        <button 
          className='login-with-google-btn' 
          onClick={signInWithGoogle}>
            Sign in with google
        </button>
    </div>
  )
}

export default Login;
