import React from 'react'
import './App.css'
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import SignupSignin from './pages/Signup'
import Dashboard from './pages/Dashboard'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignupSignin/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
