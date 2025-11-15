const Truck = require('../models/Truck');

const getAllTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find();
    res.json(trucks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trucks' });
  }
};

const addTruck = async (req, res) => {
  const { number, capacity, status } = req.body;
  try {
    const truck = await Truck.create({ number, capacity, status });
    res.status(201).json(truck);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add truck' });
  }
};

module.exports = { getAllTrucks, addTruck };
