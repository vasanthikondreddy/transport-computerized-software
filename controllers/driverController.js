// controllers/driverController.js
const Consignment = require('../models/Consignment');
const Truck = require('../models/Truck');

/**
 * Get consignments assigned to the logged-in driver
 */
const getDriverConsignments = async (req, res) => {
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

/**
 * Update truck status (driver or manager only)
 */
const updateTruckStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const truck = await Truck.findById(req.params.id);

    if (!truck) return res.status(404).json({ message: 'Truck not found' });

    // Only assigned driver or manager can update
    if (req.user.role !== 'manager' && !truck.driver.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    truck.status = status;
    truck.lastUpdated = Date.now();
    await truck.save();

    res.json({ message: 'Truck status updated', truck });
  } catch (err) {
    console.error('Error updating truck status:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Driver dashboard: consignments + truck status
 */
const getDriverDashboard = async (req, res) => {
  try {
    const consignments = await Consignment.find({ assignedDriver: req.user._id });
    const truck = await Truck.findOne({ driver: req.user._id });

    res.json({
      consignments,
      truckStatus: truck ? truck.status : 'No truck assigned',
      truckDetails: truck || null
    });
  } catch (err) {
    console.error('Error fetching driver dashboard:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Manager dashboard: all consignments + trucks
 */
const getManagerDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const consignments = await Consignment.find()
      .populate('assignedDriver', 'name email')
      .populate('assignedTruck', 'numberPlate status');

    const trucks = await Truck.find()
      .populate('driver', 'name email');

    res.json({ consignments, trucks });
  } catch (err) {
    console.error('Error fetching manager dashboard:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getDriverConsignments,
  updateTruckStatus,
  getDriverDashboard,
  getManagerDashboard
};
