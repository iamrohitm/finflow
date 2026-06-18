import React from 'react'
import './App.css'
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import SignupSignin from './pages/Signup'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignupSignin/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
