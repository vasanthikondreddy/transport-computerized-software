const mongoose = require('mongoose');

const ConsignmentSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  volume: { type: Number, required: true },
  destination: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'dispatched', 'delivered', 'delayed'],
    default: 'pending'
  },
  receiver: {
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String }
},
transportCharge: { type: Number },
dispatchedAt: { type: Date },
deliveredAt: { type: Date },
branch: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Branch',
  required: true
}
,
  truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Consignment', ConsignmentSchema);
