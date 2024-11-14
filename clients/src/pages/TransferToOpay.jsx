// PaymentForm.js
import React, { useState } from 'react';
import axios from 'axios';

const TransferToOpay = () => {
    const [amount, setAmount] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [transactionReference, setTransactionReference] = useState(null);
    const [error, setError] = useState(null);
  
    const handleInitTransaction = async (e) => {
      e.preventDefault();
  
      try {
        const result = await axios.post('http://localhost:5001/api/v1/monnify/init-transaction', {
          amount,
          paymentType,
          email,
          phoneNumber
        });
  
        setTransactionReference(result.data.transactionReference); // Adjust based on the actual response structure
        setError(null);
      } catch (error) {
        console.error('Error initializing transaction:', error.response?.data || error.message);
        setError('Failed to initialize transaction');
        setTransactionReference(null);
      }
    };
  
    return (
      <div>
        <form onSubmit={handleInitTransaction}>
          <div>
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Payment Type:</label>
            <input
              type="text"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Phone Number:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <button type="submit">Initialize Transaction</button>
        </form>
  
        {transactionReference && (
          <div>
            <h3>Transaction Reference:</h3>
            <p>{transactionReference}</p>
          </div>
        )}
  
        {error && (
          <div>
            <h3>Error:</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  };

export default TransferToOpay;
