const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Truck = require('../models/Truck');

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['driver', 'branchManager', 'admin', 'customer']).withMessage('Invalid role'),
    body('branch').optional().isMongoId().withMessage('Branch must be a valid ID') // ✅ optional but validated
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, branch } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = new User({ name, email, password: hashedPassword, role });

      // ✅ Assign branch if applicable
      if (['branchManager', 'driver'].includes(role) && branch) {
        user.branch = branch;
      }

      await user.save();

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          branch: user.branch || null
        }
      });
    } catch (err) {
      res.status(500).json({ message: 'Registration failed', error: err.message });
    }
  }
);
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // ✅ Include branch in token if present
    const tokenPayload = {
      id: user._id,
      role: user.role,
      ...(user.branch && { branch: user.branch }) // ✅ only include if exists
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch || null
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.get('/users',  async (req, res) => {
  const { role } = req.query;
  const query = role ? { role } : {};
  const users = await User.find(query).select('name _id role');
  res.json({ users });
});

router.get('/unassigned-drivers', async (req, res) => {
  try {
    const assigned = await Truck.find({ assignedDriver: { $ne: null } }).distinct('assignedDriver');
    const unassignedDrivers = await User.find({
      role: 'driver',
      _id: { $nin: assigned }
    }).select('name _id role');
    res.json({ users: unassignedDrivers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch unassigned drivers', error: err.message });
  }
});
module.exports = router;
