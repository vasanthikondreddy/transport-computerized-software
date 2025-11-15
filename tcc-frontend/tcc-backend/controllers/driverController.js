const Consignment = require('../models/Consignment');
const Truck = require('../models/Truck');

exports.getDriverConsignments = async (req, res) => {
  try {
    const driverId = req.user._id; 

    const consignments = await Consignment.find({ assignedDriver: driverId })
      .populate('truck', 'number location capacity')
      .populate('branch', 'name')
      .populate('sender', 'name');

    res.status(200).json(consignments);
  } catch (err) {
    console.error('Error fetching driver consignments:', err);
    res.status(500).json({ message: 'Failed to fetch consignments', error: err.message });
  }
};


