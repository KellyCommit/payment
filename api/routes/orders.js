const router = require('express').Router();
const Order = require("../Models/Order");

// POST route to save transaction details
router.post('/save-transaction', async (req, res) => {
    const { transactionReference, accountNumber, bankName, accountName, accountDurationSeconds, amount } = req.body;
  
    try {
      // Create a new order document
      const order = new Order({
        transactionReference,
        accountNumber,
        bankName,
        accountName,
        accountDurationSeconds,
        amount,
      });
  
      // Save order to the database
      await order.save();
      res.status(201).json({ message: 'Transaction saved successfully' });
    } catch (error) {
      console.error('Error saving transaction:', error.message);
      res.status(500).json({ message: 'Failed to save transaction' });
    }
  });
  
  // GET route to retrieve transaction details by transaction reference
  router.get('/get-transaction/:transactionReference', async (req, res) => {
    const { transactionReference } = req.params;
  
    try {
      // Find the order by transaction reference
      const order = await Order.findOne({ transactionReference });
      
      if (!order) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      res.status(200).json(order);
    } catch (error) {
      console.error('Error retrieving transaction:', error.message);
      res.status(500).json({ message: 'Failed to retrieve transaction' });
    }
  });
  
  module.exports = router;