const mongoose = require('mongoose');

const ConsignmentSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  volume: {
    type: Number,
    required: true,
    min: 1,
    max: 500
  },
  destination: {
    type: String,
    required: true
  },
  receiver: {
    name: { type: String },
    address: { type: String },
    contact: { type: String } 
  },
  truck: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Truck'
},

assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    
  },
  status: {
    type: String,
    enum: ['pending', 'dispatched', 'delivered', 'delayed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Consignment', ConsignmentSchema);
