const router = require('express').Router();
const axios = require('axios');
const MonnifyPayment = require('../Models/MonnifyPayment');
require('dotenv').config();

const apiKey = process.env.MONNIFY_API_KEY;
const secretKey = process.env.MONNIFY_SECRET_KEY;
const contractCode = process.env.MONNIFY_CONTRACT_CODE;
const baseURL = process.env.MONNIFY_BASE_URL || 'https://sandbox.monnify.com';
const paymentMethods = ["ACCOUNT_TRANSFER"];
const paymentDescription =  "Trial transaction";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
};

const getAccessToken = async () => {
  try {
    const authResponse = await axios.post(`${baseURL}/api/v1/auth/login`, {}, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${secretKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });
    return authResponse.data.responseBody.accessToken;
  } catch (error) {
    console.error('Error generating access token:', error.response?.data || error.message);
    throw new Error('Failed to generate access token');
  }
};

// Helper function to fetch banks and select a random bank code
const getRandomBankCode = async (accessToken) => {
  try {
    // Fetch the list of banks from Monnify
    const response = await axios.get(`${baseURL}/api/v1/banks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Check if banks are available
    if (!response.data.responseBody || !response.data.responseBody.length) {
      throw new Error('No banks found');
    }

     // Shuffle the banks array
     const banks = response.data.responseBody;
     shuffleArray(banks); // Shuffle the array to ensure randomness
 
     // Select the first bank after shuffling
     const randomBank = banks[0];
     return randomBank.bankCode;

  } catch (error) {
    console.error('Error fetching bank list:', error.response?.data || error.message);
    throw new Error('Failed to fetch bank list');
  }
};

// Endpoint to initialize transaction and generate bank details for one-time transfer
router.post('/initiate-transfer', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const { amount, customerName, customerEmail, paymentReference, currencyCode = 'NGN' } = req.body;

    // Validate required fields
    if (!amount || !customerName || !customerEmail || !paymentReference) {
      return res.status(400).json({ error: "Required fields cannot be null" });
    }

    // Step 1: Initialize the transaction
    const initTransactionResponse = await axios.post(
      `${baseURL}/api/v1/merchant/transactions/init-transaction`,
      {
        amount,
        customerName,
        customerEmail,
        paymentReference,
        currencyCode,
        contractCode,
        paymentMethods,
        paymentDescription
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Log transaction initialization response for debugging
    console.log('Transaction initialization response:', initTransactionResponse.data);

    if (!initTransactionResponse.data.responseBody || !initTransactionResponse.data.responseBody.transactionReference) {
      return res.status(500).json({ error: 'Transaction initialization failed', details: initTransactionResponse.data });
    }

    const transactionReference = initTransactionResponse.data.responseBody.transactionReference;
 // Step 2: Generate a random bank code for the bank transfer
 const randomBankCode = await getRandomBankCode(accessToken);

    // Step 3: Generate dynamic account for bank transfer
    const bankTransferRequest = {
      transactionReference,
      bankCode: randomBankCode
    };

    // Log request body for bank transfer
    console.log('Bank Transfer Request:', bankTransferRequest);

    // Check if transactionReference is valid
    if (!transactionReference) {
      return res.status(400).json({ error: "Invalid transaction reference" });
    }

    // Step 3: Call the bank transfer API
    const bankTransferResponse = await axios.post(
      `${baseURL}/api/v1/merchant/bank-transfer/init-payment`,
      bankTransferRequest,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Log bank transfer response for debugging
    console.log('Bank transfer response:', bankTransferResponse.data);

    // Return the bank account details
    if (bankTransferResponse.data.requestSuccessful) {
      res.json({
        transactionReference,
        accountDetails: bankTransferResponse.data.responseBody,
      });
    } else {
      res.status(500).json({
        error: 'Bank transfer initialization failed',
        details: bankTransferResponse.data.responseMessage,
      });
    }
  } catch (error) {
    console.error('Error initializing bank transfer transaction:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initialize bank transfer', details: error.response?.data });
  }
});

// Endpoint to verify transaction status
router.get('/verify-transaction/:reference', async (req, res) => {
  try {
    const accessToken = await getAccessToken(); 
    const { reference } = req.params;  // Get reference from the URL params

    // Make the API request to Monnify to verify the payment
    const response = await axios.get(
      `${baseURL}/api/v1/merchant/transactions/query?transactionReference=${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const paymentStatus = response.data.paymentStatus;  
    const responseBody = response.data.responseBody;

    // Check if the payment status is 'paid'
    if (paymentStatus === 'PAID' || paymentStatus === 'paid') {
      // Assuming you are getting transaction details from the response
      const paymentDetails = {
        transactionID: reference,  
        status: 'paid',            
        amount: responseBody.amount, 
        bankCode: responseBody.bankCode,
        paymentReference: responseBody.paymentReference,
        date: new Date(),  // Save the current date
      };

      // Save payment details in the database
      const payment = new MonnifyPayment(paymentDetails);
      await payment.save();

      // Respond with success message
      res.json({ message: 'Payment was successful' });
    } else {
      res.json({ message: 'Payment failed', status: paymentStatus });
    }
  } catch (error) {
    console.error('Error verifying transaction status:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to verify transaction status' });
  }
});

// Endpoint to get payment details by paymentReference
router.get('/payment-details/:paymentReference', async (req, res) => {
  try {
    const { paymentReference } = req.params;

    // Find the payment details by paymentReference
    const paymentDetails = await MonnifyPayment.findOne({ paymentReference });

    if (!paymentDetails) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Return the payment details if found
    res.json(paymentDetails);
  } catch (error) {
    console.error('Error fetching payment details:', error.message);
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
});


module.exports = router;
