import React from 'react'
import './notice.css';
const Notice = ({ onClose }) => {
  return (
    <div className='modal'>
        <div className="modal-wrapper">
            <p>Tips</p>
            <p>After the payment is successful, 
            <span>you must come back here and click the "I have made this bank transfer"
            Button below to submit the Sender's name</span>,Only then your money  will reach your account.</p>
            <button onClick={onClose}>Ok</button>
        </div>
    </div>
  )
}

export default Notice