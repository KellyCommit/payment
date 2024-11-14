import React from 'react'
import './paymentGuide.css';

const PaymentGuide = () => {
  return (
    <div className='payment-guide'>
      <div className="guide">
        <p>ⓘ Fill in the Note/Remark/Narration when transfer pls.</p>
      </div>
      <div className="payment-guide-wrapper">
          <h1>Payment Guide</h1>
          <p>⚠️1. Please complete the payment within the specified time! <span>Otherwise your account will not be credited!</span></p>
          <p>⚠️2. Please fill in the Note when transferring. <span>Otherwise it will not be automatically credited</span></p>
          <p>⚠️3. Please do not transfer funds to accounts twice, do not save these accounts to make payments <span>or you will lose your money!</span></p>
          <p>⚠️4. After complementing payment,<span>Please click the "I have paid" button below, and your payment will be sent for confirmation</span></p>
        </div>
    </div>
  )
}

export default PaymentGuide