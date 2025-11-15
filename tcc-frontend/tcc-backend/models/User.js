const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },

  role: {
    type: String,
    enum: ['admin', 'customer', 'driver', 'branchManager'],
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
