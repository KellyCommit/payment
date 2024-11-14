import React from 'react'
import { createPortal } from 'react-dom';
import './status.css';

const Status = ({ message, icon }) => {
    return createPortal(
        <div className='copied-modal'>
          <p>{message}<i className={`bx ${icon}`}></i></p>
        </div>,
        document.body
);
}

export default Status;