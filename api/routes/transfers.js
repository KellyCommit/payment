const router = require('express').Router();
const axios = require('axios');
const Payment = require("../models/Payment");

// POST route to confirm wallet payment
router.post('/confirm-wallet', async (req, res) => {
    const { orderNo, firstName, lastName, amount, apiKey, gateway } = req.body;

    try {
        let paymentVerified = false;

        // Call the corresponding payment gateway based on the 'gateway' parameter
        if (gateway === 'Opay') {
            paymentVerified = await verifyOpayPayment(orderNo);
        } else if (gateway === 'PalmPay') {
            paymentVerified = await verifyPalmPayPayment(orderNo);
        } else if (gateway === 'Moniepoint') {
            paymentVerified = await verifyMoniepointPayment(orderNo);
        }

        if (paymentVerified) {
            // Update payment status in the database to 'confirmed'
            await Payment.findOneAndUpdate(
                { apiKey }, // Match the payment record and apiKey
                { paymentStatus: 'confirmed' }, // Update the paymentStatus to 'confirmed'
                { new: true } // Return the updated document
            );

            return res.json({ success: true });
        } else {
            // If payment is not verified, respond with a failure
            return res.json({ success: false, message: 'Payment verification failed.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'An error occurred during payment verification.' });
    }
});

// Function to verify payment with Opay
async function verifyOpayPayment(orderNo) {
    try {
        const response = await axios.post(
            'https://cashierapi.opayweb.com/api/v3/transfer/status/toWallet',
            {
                orderNo: orderNo,
                reference: process.env.OPAY_MERCHANT_ID,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPAY_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.success; // Assume the API returns a success field
    } catch (error) {
        console.error('Opay verification error:', error);
        return false;
    }
}

// Function to verify payment with PalmPay
async function verifyPalmPayPayment(orderNo) {
    try {
        const response = await axios.post(
            'https://api.palmpay.co/transaction/verify',
            {
                reference: orderNo,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PALMPAY_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.status === 'success'; // Check for specific success status
    } catch (error) {
        console.error('PalmPay verification error:', error);
        return false;
    }
}

// Function to verify payment with Moniepoint
async function verifyMoniepointPayment(orderNo) {
    try {
        const response = await axios.post(
            'https://api.moniepoint.com/v1/transaction/verify',
            {
                transactionId: orderNo,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.MONIEPOINT_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.status === 'success'; // Check for specific success status
    } catch (error) {
        console.error('Moniepoint verification error:', error);
        return false;
    }
}
// Route to initiate a transfer to Opay
router.post('/initiate-transfer', async (req, res) => {
    const { amount, recipientPhone, recipientName } = req.body;

    try {
        const response = await axios.post(
            'https://cashierapi.opayweb.com/api/v3/transfer/toWallet',
            {
                amount: amount,
                currency: "NGN",
                recipient: {
                    phone: recipientPhone,
                    name: recipientName,
                },
                reference: generateReference(),
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPAY_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
    
        console.log('Opay API response:', response.data); // Log the entire response
        
        if (response.data.success) {
            res.json({
                success: true,
                message: 'Transfer initiated successfully',
                data: response.data.data,
            });
        } else {
            res.status(400).json({
                success: false,
                message: response.data.message || 'Transfer initiation failed',
            });
        }
    } catch (error) {
        console.error('Opay transfer error:', error.response ? error.response.data : error.message); // Log error details
        res.status(500).json({
            success: false,
            message: 'An error occurred during the transfer.',
        });
    }
});

// Function to generate a unique reference for the transaction
function generateReference() {
    return `TXN_${Date.now()}`;
}
module.exports = router;
