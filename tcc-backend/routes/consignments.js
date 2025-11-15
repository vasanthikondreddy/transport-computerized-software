const express = require('express');
const router = express.Router();
const Consignment = require('../models/Consignment');
const Truck = require('../models/Truck');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
router.post('/', async (req, res) => {
  try {
    const { sender, volume, destination, receiver } = req.body;

    // Create consignment
    const consignment = await Consignment.create({
      sender,
      volume,
      destination,
      receiver
    });

    // Calculate charge (example: ₹10 per m³)
    const transportCharge = volume * 10;
    await Invoice.create({ consignment: consignment._id, amount: transportCharge });

    // Check total volume for destination
    const totalVolume = await Consignment.aggregate([
      { $match: { destination, status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$volume' } } }
    ]);

    const volumeSum = totalVolume[0]?.total || 0;

    // If volume ≥ 500, assign truck
    if (volumeSum >= 500) {
      const truck = await Truck.findOne({ status: 'idle', location: destination });
      if (truck) {
        await Consignment.updateMany(
          { destination, status: 'pending', truck: null },
          { $set: { truck: truck._id, status: 'dispatched', dispatchedAt: new Date() } }
        );
        truck.status = 'in-transit';
        truck.lastUsed = new Date();
        truck.assignedVolume = volumeSum;
        await truck.save();
      }
    }

    res.status(201).json({ message: 'Consignment created', consignmentId: consignment._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating consignment' });
  }
});
router.post('/submit', auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { destination, volume } = req.body;
    if (!destination || !volume) {
      return res.status(400).json({ message: 'Destination and volume are required' });
    }

    const consignment = new Consignment({
      sender: req.user.id,
      destination,
      volume,
      status: 'pending',
      createdAt: new Date()
    });

    await consignment.save();
    res.status(201).json({ message: 'Consignment submitted', consignment });
  } catch (err) {
    console.error("Consignment submit error:", err);
    res.status(500).json({ message: 'Failed to submit consignment', error: err.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    if (!req.user ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const consignments = await Consignment.find({ branch: req.user.branchId })
      .populate('truck', 'number')
      .populate('branch', 'name')
      .populate('assignedDriver', 'name');

    res.json({ consignments });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch consignments', error: err.message });
  }
});

router.put('/assign/:id', auth, requireRole('branchManager'), async (req, res) => {
  try {
    const { branch, truck, assignedDriver } = req.body; // assignedDriver must be ObjectId

    const consignment = await Consignment.findByIdAndUpdate(
      req.params.id,
      { branch, truck, assignedDriver },   // ✅ driver’s _id, not name
      { new: true }
    ).populate('branch', 'name')
     .populate('truck', 'number')
     .populate('assignedDriver', 'name');

    if (!consignment) return res.status(404).json({ message: 'Consignment not found' });

    res.json({ message: 'Assignment updated', consignment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign', error: err.message });
  }
});




// Manager: list consignments for their branch
router.get('/branch', auth, async (req, res) => {
  try {
    if (req.user.role !== 'branchManager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!req.user.branchId) {
      return res.status(400).json({ message: 'Manager has no branch assigned' });
    }

    const consignments = await Consignment.find({ branch: req.user.branchId })
      .populate('branch', 'name')
      .populate('truck', 'number location capacity')
      .populate('assignedDriver', 'name');

    res.json({ consignments });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch consignments', error: err.message });
  }
});

router.get('/driver/consignments', auth, async (req, res) => {
  try {
    const consignments = await Consignment.find({ assignedDriver: req.user.id })
      .populate('truck', 'number')
      .populate('branch', 'name')
      .populate('sender', 'name email');

    res.json({ consignments });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching consignments', error: err.message });
  }
});
router.get('/my', auth, requireRole('customer'), async (req, res) => {
  try {
    const consignments = await Consignment.find({ sender: req.user.id });
    res.json({ consignments });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your consignments', error: err.message });
  }
});
router.get('/assigned', auth, requireRole('driver'), async (req, res) => {
  try {
    const consignments = await Consignment.find({ assignedDriver: req.user.id })
      .populate('sender', 'name email')
      .populate('truck', 'number')
      .populate('assignedDriver', 'name');

    res.json({ consignments });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching consignments', error: err.message });
  }
});

router.get('/history', auth, requireRole('driver'), async (req, res) => {
  try {
    const history = await Consignment.find({
      assignedDriver: req.user.id,
      status: 'delivered'
    });
    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history', error: err.message });
  }
});
// POST /assign-truck
router.post('/assign-truck', auth, requireRole('branchManager'), async (req, res) => {
  const { consignmentId, truckId } = req.body;

  try {
    // Fetch truck and validate
    const truck = await Truck.findById(truckId);
    if (!truck || truck.status !== 'idle') {
      return res.status(400).json({ message: 'Truck not available or not idle' });
    }

    // Ensure truck has a driver assigned
    if (!truck.assignedDriver) {
      return res.status(400).json({ message: 'Truck has no assigned driver' });
    }

    // Fetch consignment and validate
    const consignment = await Consignment.findById(consignmentId);
    if (!consignment || consignment.status !== 'pending') {
      return res.status(400).json({ message: 'Consignment not eligible for dispatch' });
    }

    // Assign truck and driver to consignment
    consignment.truck = truck._id;
    consignment.assignedDriver = truck.assignedDriver;
    consignment.status = 'dispatched';
    await consignment.save();

    // Update truck metadata
    truck.status = 'in-transit';
    truck.assignedVolume = consignment.volume;
    truck.lastUsed = new Date();
    await truck.save();

    res.json({ message: 'Truck and driver assigned successfully', consignment });
  } catch (err) {
    console.error('Assignment error:', err.message);
    res.status(500).json({ message: 'Assignment failed', error: err.message });
  }
});



router.get('/filter', auth, requireRole('branchManager'), async (req, res) => {
  const { destination, status, startDate, endDate } = req.query;

  const query = {};
  if (destination) query.destination = destination;
  if (status) query.status = status;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  try {
    const results = await Consignment.find(query).populate('sender', 'name email');
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: 'Error filtering consignments', error: err.message });
  }
});
router.get('/summary', auth, requireRole('branchManager'), async (req, res) => {
  try {
    const consignmentStats = await Consignment.aggregate([
      {
        $group: {
          _id: { destination: '$destination', status: '$status' },
          count: { $sum: 1 }
        }
      }
    ]);
    const summary = {};
    consignmentStats.forEach(stat => {
      const { destination, status } = stat._id;
      if (!summary[destination]) {
        summary[destination] = { pending: 0, dispatched: 0, delivered: 0 };
      }
      summary[destination][status] = stat.count;
    });
    const trucks = await Truck.find({}, 'location status assignedVolume lastUsed');
    res.json({ summary, trucks });
  } catch (err) {
    res.status(500).json({ message: 'Error generating summary', error: err.message });
  }
});
router.put('/update-status/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'in-transit', 'delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const consignment = await Consignment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!consignment) {
      return res.status(404).json({ message: 'Consignment not found' });
    }

    res.status(200).json({ message: 'Status updated', consignment });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const consignment = await Consignment.findById(req.params.id).populate('sender', 'name email');
    if (!consignment) {
      return res.status(404).json({ message: 'Consignment not found' });
    }
    res.json({ consignment });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching consignment', error: err.message });
  }
});

router.get('/trucks/all', auth, requireRole('branchManager'), async (req, res) => {
  try {
    const trucks = await Truck.find({}).populate('assignedDriver', 'name');;
    res.json(trucks); // frontend expects a plain array
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trucks', error: err.message });
  }
});

router.get('/users/drivers', auth, requireRole('branchManager'), async (req, res) => {
  const drivers = await User.find({ role: 'driver' }, '_id name email');
  res.json(drivers);
});

router.get('/manager/consignments', auth, requireRole('branchManager'), async (req, res) => {
  const { destination, status, fromDate, toDate } = req.query;
  const query = {};

  if (destination) query.destination = destination;
  if (status) query.status = status;

  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) {
      const parsedFrom = new Date(fromDate);
      if (!isNaN(parsedFrom)) query.createdAt.$gte = parsedFrom;
    }
    if (toDate) {
      const parsedTo = new Date(toDate);
      if (!isNaN(parsedTo)) query.createdAt.$lte = parsedTo;
    }
    // Remove empty createdAt if no valid dates
    if (Object.keys(query.createdAt).length === 0) delete query.createdAt;
  }

  try {
    const consignments = await Consignment.find(query)
      // .populate('truck assignedDriver sender', 'name number email');
       .populate('truck','number')
      .populate('assignedDriver', 'name email');
    res.json({ consignments }); // ✅ Wrap response for frontend
  } catch (err) {
    res.status(500).json({ message: 'Error fetching manager consignments', error: err.message });
  }
});

router.get('/manager/stats', auth, requireRole('branchManager'), async (req, res) => {
  try {
    const stats = await Consignment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    const result = {
      pending: 0,
      dispatched: 0,
      delivered: 0,
      delayed: 0
    };
    stats.forEach(s => {
      result[s._id] = s.count;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
});
router.put('/:id/assign-truck', auth, requireRole('branchManager'), async (req, res) => {
  const { truckId } = req.body;
  try {
    const consignment = await Consignment.findById(req.params.id);
    const truck = await Truck.findById(truckId);
    if (!truck || truck.status !== 'idle') {
      return res.status(400).json({ message: 'Truck not available' });
    }

    consignment.truck = truckId;
    consignment.status = 'dispatched';
    consignment.assignedDriver = truck.assignedDriver; // ✅ Correct field
    await consignment.save();

    truck.status = 'in-transit';
    truck.lastUsed = new Date();
    await truck.save();

    res.json({ message: 'Truck assigned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning truck', error: err.message });
  }
});



module.exports = router;
