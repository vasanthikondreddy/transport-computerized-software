const User = require('../models/User');

const getUserSummary = async (req, res) => {
  try {
    const users = await User.find({}, 'role');
    const summary = {
      customers: 0,
      drivers: 0,
      managers: 0,
      totalUsers: users.length
    };

    users.forEach(user => {
      if (user.role === 'customer') summary.customers++;
      else if (user.role === 'driver') summary.drivers++;
      else if (user.role === 'branchManager') summary.managers++;
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Error generating user summary', error: err.message });
  }
};

module.exports = { getUserSummary };
