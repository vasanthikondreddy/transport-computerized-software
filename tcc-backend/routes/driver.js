const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const { getDriverConsignments } = require('../controllers/driverController');

router.get('/consignments', auth, requireRole('driver'), getDriverConsignments);
router.get('/driver/consignments', auth, async (req, res) => {
  try {
    console.log("Driver ID:", req.user.id); // ✅ confirm driver ID

    const consignments = await Consignment.find({ assignedDriver: req.user.id })
      .populate('truck', 'number')
      .populate('branch', 'name')
      .populate('sender', 'name email');

    console.log("Returned consignments:", consignments.length); // ✅ confirm result
    res.json({ consignments });
  } catch (err) {
    console.error("Driver route error:", err);
    res.status(500).json({ message: 'Error fetching consignments', error: err.message });
  }
});



module.exports = router;
