const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

// Create invoice
router.post('/create', auth, requireRole('branchManager'), async (req, res) => {
  const { consignment, truck, branch, customerName, amount } = req.body;

  if (!consignment || !truck || !branch || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const invoice = new Invoice({ consignment, truck, branch, customerName, amount });
  await invoice.save();
  res.status(201).json({ message: 'Invoice created', invoice });
});

// Mark invoice as paid
router.patch('/pay/:id', auth, requireRole('admin'), async (req, res) => {
  const { paymentMethod } = req.body;
  const invoice = await Invoice.findByIdAndUpdate(
    req.params.id,
    { status: 'paid', paidAt: new Date(), paymentMethod },
    { new: true }
  );
  res.json({ message: 'Invoice marked as paid', invoice });
});

// Get all invoices
router.get('/all', auth, async (req, res) => {
  const invoices = await Invoice.find().populate('consignment truck branch');
  res.json({ invoices });
});

module.exports = router;
