const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch'); // Make sure this model exists
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
// Get all branches
router.get('/all', async (req, res) => {
  try {
    const branches = await Branch.find({}, 'name _id'); // Only return name and ID
    res.json({ branches });
  } catch (err) {
    console.error('Error fetching branches:', err);
    res.status(500).json({ message: 'Failed to fetch branches' });
  }
});

router.post('/create', auth, requireRole('branchManager'), async (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: 'Name and location are required' });
  }

  const branch = new Branch({ name, location });
  await branch.save();
  res.status(201).json({ message: 'Branch created', branch });
});

router.get('/all', auth, async (req, res) => {
  const branches = await Branch.find({}, 'name location');
  res.json({ branches });
});
module.exports = router;
