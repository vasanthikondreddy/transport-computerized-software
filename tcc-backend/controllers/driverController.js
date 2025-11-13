const Consignment = require('../models/Consignment');
const Truck = require('../models/Truck');

exports.getDriverConsignments = async (req, res) => {
  try {
    const driverId = req.user._id;

    const trucks = await Truck.find({ assignedDriver: driverId }).select('_id');
    const truckIds = trucks.map(t => t._id);

    const consignments = await Consignment.find({ truck: { $in: truckIds } })
      .populate('truck')
      .populate('sender');
    console.log("Driver ID:", req.user._id);

    res.status(200).json(consignments);
  } catch (error) {
    console.error('Error fetching driver consignments:', error);
    res.status(500).json({ message: 'Failed to fetch consignments' });
  }
};
