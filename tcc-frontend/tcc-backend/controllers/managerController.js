
const Consignment = require('../models/Consignment');

exports.assignDriverToConsignment = async (req, res) => {
  try {
    const { driverId, consignmentId } = req.body;

    const consignment = await Consignment.findById(consignmentId);
    if (!consignment) return res.status(404).json({ message: 'Consignment not found' });

    consignment.assignedDriver = driverId;
    await consignment.save();

    res.status(200).json({ message: 'Driver assigned successfully', consignment });
  } catch (error) {
    console.error('Error assigning driver:', error);
    res.status(500).json({ message: 'Failed to assign driver' });
  }
};
