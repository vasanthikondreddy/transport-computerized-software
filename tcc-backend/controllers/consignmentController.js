const Consignment = require('../models/Consignment');
const Truck = require('../models/Truck');
const getAllConsignments = async (req, res) => {
  try {
    const consignments = await Consignment.find().populate('truck');
    res.json(consignments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch consignments' });
  }
};




exports.createConsignment = async (req, res) => {
  try {
    const { volume, destination, truck: truckId, assignedDriver } = req.body;
    const senderId = req.user._id;

    const truck = await Truck.findById(truckId);
    if (!truck) return res.status(404).json({ message: 'Truck not found' });

    const consignment = new Consignment({
      sender: senderId,
      volume,
      destination,
      truck: truckId,
      assignedDriver 
    });

    await consignment.save();

    res.status(201).json({ message: 'Consignment created', consignment });
  } catch (error) {
    console.error('Error creating consignment:', error);
    res.status(500).json({ message: 'Failed to create consignment' });
  }
};


module.exports = { getAllConsignments,getDriverConsignments, createConsignment };
