import React from 'react'
import './styles.css'

const Input = ({label, state, setState, placeholder}) => {
  return (
    <div className='input-wrapper'>
        <p className='input-label'>{label}</p>
        <input 
            className='custom-input'
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder={placeholder}
        />
    </div>
  )
}

export default Input
