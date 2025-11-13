const Consignment = require('../models/Consignment');
const User = require('../models/User');

exports.assignDriverToConsignment = async (req, res) => {
  const { consignmentId, driverId } = req.body;

  try {
    const consignment = await Consignment.findById(consignmentId);
    const driver = await User.findById(driverId);

    if (!consignment || !driver) {
      return res.status(404).json({ message: 'Consignment or Driver not found' });
    }

    if (consignment.assignedDriver) {
      return res.status(400).json({ message: 'Driver already assigned' });
    }

    consignment.assignedDriver = driverId;
    await consignment.save();
    await consignment.populate('assignedDriver', 'name email');

    res.status(200).json({ message: 'Driver assigned successfully', consignment });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
