const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const { getUserSummary } = require('../controllers/adminController');

router.get('/users', auth, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find({}, 'name email role');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});


router.delete('/users/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});
router.get('/user-count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ totalUsers: count });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user count', error: err.message });
  }
});

router.get('/users/summary', auth, requireRole('admin'), getUserSummary);
module.exports = router;
