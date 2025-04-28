import React from 'react'
import './style.css'

function Title(props) {
  return (
    <div className='common-title-container'>
      <div className='common-title'>
        <h2>{props.title}</h2>
        {props.description && (
          <p className="common-description">{props.description}</p>
        )}
      </div>
    </div>
  )
}

export default Title
