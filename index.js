const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const managerRoutes = require('./routes/manager');
const driverRoutes = require('./routes/driver');
const  branchRoutes = require('./routes/branches');
const invoiceRoutes = require('./routes/invoices');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/consignments', require('./routes/consignments'));
app.use('/api/trucks', require('./routes/trucks'));
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/branches', require('./routes/branches'));
app.use('/api/invoices', require('./routes/invoices'));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
