const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const { getDriverConsignments } = require('../controllers/driverController');
const { getDriverDashboard } = require('../controllers/driverController');
const { updateTruckStatus } = require('../controllers/driverController');
router.get('/consignments', auth, getDriverConsignments);

// Driver dashboard
router.get('/dashboard', auth, getDriverDashboard);

// Truck status update
router.put('/trucks/:id/status', auth, updateTruckStatus);

module.exports = router;


