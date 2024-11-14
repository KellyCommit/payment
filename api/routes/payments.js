const router = require('express').Router();
const Payment = require("../models/Payment");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const { verify, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../verifyToken');

// Middleware to verify API key
const verifyApiKey = async (req, res, next) => {
    try {
        const apiKey = req.query.apiKey;
        if (!apiKey) {
            return res.status(400).json({ error: 'API key is missing from the request' });
        }
        const user = await User.findOne({ apiKey });
        if (!user) {
            return res.status(404).json({ error: 'Invalid API key or user not found' });
        }
        req.user = user;  // Attach user to request object for further use
        next();
    } catch (error) {
        console.error('Error verifying API key:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Receive payment notification
router.post('/notify-payment', async (req, res) => {
    const { firstName, lastName, amount, apiKey } = req.body;
    // Find user by API key
    const user = await User.findOne({ apiKey });
    if (!user) {
        return res.status(404).json({ error: 'Invalid API key' });
    }
    let paymentNotification = new Payment({
        firstName,
        lastName,
        amount,
        apiKey,
        status: 'Pending'
    });
    const payment = await paymentNotification.save();
    return res.status(200).json({
        payment,
        message: 'Payment notification received. Awaiting confirmation.'
    });
});
//GET ALL payments
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const payments = query ? await Payment.find().sort({ _id: -1 }) : await Payment.find();
        res.status(200).json(payments);
    } catch (err) {
        console.error('Error fetching payments:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Route to get payments made through a specific API key
router.get('/by-apikey', verifyApiKey, async (req, res) => {
    try {

        const payments = await Payment.find({ apiKey: req.user.apiKey });
        // Return the payments
        res.status(200).json({ payments });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Confirm a payment
router.post('/confirm-payment', async (req, res) => {
    try {
        const { paymentId } = req.body;
        if (!paymentId) {
            return res.status(400).json({ error: 'Payment ID is required' });
        }
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        // Update the payment status to confirmed
        payment.paymentStatus = 'confirmed';

        // Save the updated payment
        await payment.save();

        return res.status(200).json({
            success: true,
            message: 'Payment status updated to confirmed',
            payment
        });

    } catch (error) {
        console.error('Error confirming payment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;