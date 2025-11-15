const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  consignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Consignment', required: true },
  truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  customerName: String,
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  issuedAt: { type: Date, default: Date.now },
  paidAt: Date,
  paymentMethod: String
});

module.exports = mongoose.model('Invoice', invoiceSchema);
