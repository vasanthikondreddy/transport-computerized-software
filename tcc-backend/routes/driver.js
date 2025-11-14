const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const { getDriverConsignments } = require('../controllers/driverController');

router.get('/consignments', auth, requireRole('driver'), getDriverConsignments);



module.exports = router;


