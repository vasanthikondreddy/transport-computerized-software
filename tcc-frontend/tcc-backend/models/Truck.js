const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
  number: { type: String },
  location: { type: String, required: true },
  status: { type: String, enum: ['idle', 'in-transit'], default: 'idle' },
  assignedVolume: { type: Number, default: 0 },
  lastUsed: { type: Date, default: null },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  capacity: { type: Number, required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }
});

module.exports = mongoose.model('Truck', truckSchema);
