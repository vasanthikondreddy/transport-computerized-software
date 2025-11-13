const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Truck = require('../models/Truck');
const User = require('../models/User');
const Consignment = require('../models/Consignment');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

// Helper: Find available driver from branch
const getAvailableDriver = async (branchId) => {
  const driver = await User.findOne({
    role: 'driver',
    branch: branchId,
    assignedTruck: null
  });
  return driver?._id || null;
};

// GET: Truck status with full details
router.get('/status', async (req, res) => {
  const trucks = await Truck.find().populate('assignedDriver branch');
  res.json(trucks);
});

// POST: Add truck with auto-assigned driver
router.post('/add', auth, requireRole('branchManager'), async (req, res) => {
  const { location, number, capacity, branch, assignedDriver } = req.body;

  if (!location || !number || !capacity || !branch) {
    return res.status(400).json({ message: 'Location, number, capacity, and branch are required' });
  }

  let finalDriver = assignedDriver;

  // Auto-assign if no driver selected
  if (!assignedDriver) {
    finalDriver = await getAvailableDriver(branch);
  }

  const truck = new Truck({
    location,
    number,
    capacity,
    branch,
    assignedDriver: finalDriver || null,
    status: 'idle',
    assignedVolume: 0,
    lastUsed: null
  });

  await truck.save();

  // Update driver's assignedTruck if assigned
  if (finalDriver) {
    await User.findByIdAndUpdate(finalDriver, { assignedTruck: truck._id });
  }

  res.status(201).json({ message: 'Truck added successfully', truck });
});

// GET: All trucks (lightweight)
router.get('/all', auth, async (req, res) => {
  const trucks = await Truck.find().populate('assignedDriver', 'name');
  res.json({ trucks });
});

// DELETE: Truck
router.delete('/:id', auth, async (req, res) => {
  const allowedRoles = ['admin', 'branchManager'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: Insufficient role' });
  }

  const truck = await Truck.findByIdAndDelete(req.params.id);
  if (!truck) return res.status(404).json({ message: 'Truck not found' });

  // Unassign driver if any
  if (truck.assignedDriver) {
    await User.findByIdAndUpdate(truck.assignedDriver, { assignedTruck: null });
  }

  res.json({ message: 'Truck deleted successfully' });
});

// PATCH: Update truck usage stats
router.patch('/update-usage/:id', auth, requireRole('branchManager'), async (req, res) => {
  try {
    const truckId = req.params.id;

    const volumeAgg = await Consignment.aggregate([
      { $match: { truck: mongoose.Types.ObjectId(truckId) } },
      { $group: { _id: null, total: { $sum: '$volume' } } }
    ]);
    const totalVolume = volumeAgg[0]?.total || 0;

    const updatedTruck = await Truck.findByIdAndUpdate(
      truckId,
      {
        assignedVolume: totalVolume,
        lastUsed: new Date()
      },
      { new: true }
    );

    res.json({ message: 'Truck usage updated', truck: updatedTruck });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update truck usage', error: err.message });
  }
});

module.exports = router;
