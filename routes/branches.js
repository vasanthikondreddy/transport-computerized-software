const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch'); // Make sure this model exists
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');


router.post('/create', auth, requireRole('branchManager'), async (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: 'Name and location are required' });
  }

  const branch = new Branch({ name, location });
  await branch.save();
  res.status(201).json({ message: 'Branch created', branch });
});

router.get('/all', async (req, res) => {
  try {
    const branches = await Branch.find({}, 'name _id');
    res.json({ branches }); 
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch branches' });
  }
});


module.exports = router;
