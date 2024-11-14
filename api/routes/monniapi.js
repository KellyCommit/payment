const router = require('express').Router();
const axios = require('axios');

// Endpoint to initialize a transaction
router.post('/init-transaction', async (req, res) => {
    const {
      amount,
      currency = 'NGN',
      paymentType, // e.g., card or transfer
      email, // Optional, if required by Monnify
      phoneNumber, // Optional, if required by Monnify
      // Add other parameters as required by Monnify's API
    } = req.body;
  
    try {
      const response = await axios.post(
        'https://api.monnify.com/api/v1/merchant/transactions/init-transaction',
        {
          amount,
          currency,
          paymentType,
          email,
          phoneNumber,
          // Add other parameters as required
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.MONNIFY_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      res.json(response.data);
    } catch (error) {
      console.error('Error initializing transaction:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to initialize transaction' });
    }
  });
router.post('/initiate-payment', async (req, res) => {
    const { transactionReference, bankCode } = req.body;
  
    try {
      const response = await axios.post('https://api.monnify.com/api/v1/merchant/bank-transfer/init-payment', {
        transactionReference,
        bankCode,
      }, {
        headers: {
          Authorization: `Bearer ${process.env.MONNIFY_API_KEY}`, // Replace with your Monnify API key
          'Content-Type': 'application/json'
        }
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Error initializing payment:', error.response?.data || error.message);
      res.status(500).json({ error: 'Payment initialization failed' });
    }
  });













module.exports = router;