import React, { useState, useEffect, useCallback } from 'react';
import './transfer.css';
import Notice from '../components/Notice';
import Nav from '../components/Nav';
import HomeTransfer from './HomeTransfer';
import ConfirmPayment from '../components/ConfirmPayment';
import Loading from '../images/loading.gif';
import axios from 'axios';

const Transfer = () => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(2); // Default step is 2
  const [backgroundColor, setBackgroundColor] = useState('blue');
  const [showConfirmPayment, setShowConfirmPayment] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // For storing payment status

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleModal = useCallback(() => {
    setShowConfirmPayment(true);
    setBackgroundColor(step === 2 ? 'blue' : 'red');
  }, [setShowConfirmPayment]);

  const handleSuccessSubmit = () => {
    setSubmitted(true);
    setPaymentStatus('success');
  };

  const handleFailureSubmit = () => {
    setSubmitted(true);
    setPaymentStatus('failed');
  };

  return (
    <div className="transfer">
      <Nav />
      <div className="indicators">
        <div className="indicator-wrapper">
          <div
            className="indicator"
            style={{
              backgroundColor: step >= 1 ? 'blue' : '',
            }}
          >
            {step > 1 ? <i className="bx bx-check"></i> : '1'}
          </div>
          <p>Submit</p>
        </div>
        <div className="line"></div>
        <div className="indicator-wrapper">
          <div
            className="indicator"
            style={{
              backgroundColor: step >= 2 ? 'blue' : '',
            }}
          >
            {step > 2 ? <i className="bx bx-check"></i> : '2'}
          </div>
          <p>Payment</p>
        </div>
        <div className="line"></div>
        <div className="indicator-wrapper">
          <div
            className="indicator"
            style={{
              backgroundColor: step >= 2 ? 'blue' : '',
            }}
          >
            {step > 2 ? <i className="bx bx-check"></i> : '3'}
          </div>
          <p>Completed</p>
        </div>
      </div>
      <div>
        {step === 1 && <div><h1>Default Content</h1></div>}
        {step === 2 && <div><HomeTransfer handleModal={handleModal} /></div>}
      </div>
      {showConfirmPayment && (
        <div className={`overlay-payment ${showConfirmPayment ? 'show-modal' : ''}`}>
          <div className="modal-payment">
            <ConfirmPayment
              onSuccessSubmit={handleSuccessSubmit}
              onFailureSubmit={handleFailureSubmit}
              onFormSubmit={() => setShowConfirmPayment(false)}
            />
          </div>
        </div>
      )}

      {submitted && (
        <div className="modal-success-container">
          <div className="modal-success-state">
            <p>
              {paymentStatus === 'success'
                ? 'Transaction successful, redirecting...'
                : 'Payment failed, please try again'}
            </p>
            {paymentStatus === 'success' ? (
              <p>Redirecting...</p>
            ) : (
              <button className='reset-btn' onClick={() => setSubmitted(false)}>Try Again</button>
            )}
            <img src={Loading} alt="Loading..." />
          </div>
        </div>
      )}
      {showModal && <Notice onClose={handleClose} />}
    </div>
  );
};

export default Transfer;
