const express = require('express');
const router = express.Router();
const Consignment = require('../models/Consignment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');


router.get('/drivers', auth, async (req, res) => {
  const drivers = await User.find({ role: 'driver' }, '_id name email');
  res.json(drivers);
});

router.post('/manager/assign-driver', auth, requireRole('branchManager'), async (req, res) => {
  const { consignmentId, driverId } = req.body;

  try {
    const consignment = await Consignment.findById(consignmentId);
    if (!consignment || consignment.status !== 'pending') {
      return res.status(400).json({ message: 'Consignment not eligible' });
    }

    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(400).json({ message: 'Invalid driver' });
    }

    consignment.assignedDriver = driverId;
    await consignment.save();

    res.json({ message: 'Driver assigned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning driver', error: err.message });
  }
});

module.exports = router;
