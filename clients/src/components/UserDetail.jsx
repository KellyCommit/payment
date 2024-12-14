import React, { useEffect, useState } from 'react';
import './userdetail.css';
import Status from './Status';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const UserDetail = ({ formatTime, onDurationFetched }) => {
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [transactionReference, setTransactionReference] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const transactionId = params.get('transactionId');
  
    axios.get(`https://ipayment.onrender.com/api/v1/get-transaction/${transactionId}`)
      .then(response => {
        const { accountNumber, bankName, accountName, accountDurationSeconds, amount } = response.data;
        setTransactionReference(transactionId);
        setAccountNumber(accountNumber);
        setBankName(bankName);
        setAccountName(accountName);
        setAmount(amount);

        // Pass accountDuration to HomeTransfer once fetched
        onDurationFetched(accountDurationSeconds);
      })
      .catch(error => console.error("Error fetching transaction data:", error));
  }, []);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopiedText(text);
      setTimeout(() => setCopied(false), 2000); // Hide the modal after 2 seconds
    } catch (err) {
      console.error('Failed to copy text:', err);
      setError('Failed to copy text');
    }
  };

  return (
    <>
      <div className='detail-container'>
        <div className="detail-header">
          <h1>₦ {parseFloat(amount).toFixed(2)}</h1>
          <p>Use this account for the transaction only</p>
          <p>Account will expire within <span>{formatTime()}</span></p>
        </div>
        <hr />
        <div className="detail-wrapper">
          <div className="user">
            <p>Name</p>
            <p>:</p>
            <p className='edit-u'>{accountName}</p>
          </div>
          <div className="user">
            <p>Bank</p>
            <p>:</p>
            <p className='edit-u bank-name'>{bankName}</p>
          </div>
          <div className="user-d">
            <div className="account">
              <p>Account</p>
              <p>:</p>
              <p>{accountNumber}</p>
            </div>
            <button onClick={() => handleCopy(accountNumber)}>Copy</button>
          </div>
          <div className="user-d">
            <div className="account">
              <p>Amount</p>
              <p>:</p>
              <p>₦ {parseFloat(amount).toFixed(2)}</p>
            </div>
            <button onClick={() => handleCopy(amount)}>Copy</button>
          </div>
        </div>
      </div>
      {copied && <Status message={`Copied ${copiedText}!`} />}
      {error && <Status message={error} />}
      <div className="note-detail">
        <div className="user-d">
          <div className="account">
            <p>Note</p>
            <p>:</p>
            <p>{transactionReference}</p>
          </div>
          <button onClick={() => handleCopy(transactionReference)}>Copy</button>
        </div>
      </div>
    </>
  );
};

export default UserDetail;
