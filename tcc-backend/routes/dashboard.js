const express = require('express');
const router = express.Router();
const Truck = require('../models/Truck');
const Consignment = require('../models/Consignment');
const auth = require('../middleware/auth');

router.get('/summary', auth, async (req, res) => {
  try {
    const totalTrucks = await Truck.countDocuments();
    const totalConsignments = await Consignment.countDocuments();
    const dispatched = await Consignment.countDocuments({ status: 'dispatched' });
    const pending = await Consignment.countDocuments({ status: 'pending' });

    const volumeByDestination = await Consignment.aggregate([
      { $group: { _id: '$destination', totalVolume: { $sum: '$volume' } } }
    ]);

    // Average waiting time (dispatched consignments)
    const dispatchedConsignments = await Consignment.find({ status: 'dispatched' }, 'createdAt dispatchedAt');
    const totalWaitTime = dispatchedConsignments.reduce((sum, c) => {
      if (c.dispatchedAt && c.createdAt) {
        return sum + (c.dispatchedAt - c.createdAt);
      }
      return sum;
    }, 0);
    const avgWaitingTime = dispatchedConsignments.length
      ? totalWaitTime / dispatchedConsignments.length / (1000 * 60 * 60) // in hours
      : 0;

    // Average truck idle time
    const idleTrucks = await Truck.find({ status: 'idle' }, 'lastUsed');
    const now = Date.now();
    const totalIdleTime = idleTrucks.reduce((sum, t) => {
      if (t.lastUsed) {
        return sum + (now - t.lastUsed);
      }
      return sum;
    }, 0);
    const avgIdleTime = idleTrucks.length
      ? totalIdleTime / idleTrucks.length / (1000 * 60 * 60) // in hours
      : 0;

    res.json({
      totalTrucks,
      totalConsignments,
      dispatched,
      pending,
      volumeByDestination,
      avgWaitingTime: avgWaitingTime.toFixed(2),
      avgIdleTime: avgIdleTime.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ message: 'Dashboard error', error: err.message });
  }
});

module.exports = router;
