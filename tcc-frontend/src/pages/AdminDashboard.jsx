import { useEffect, useState } from 'react';
import API from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import UserManagement from '../components/UserManagement';

function AdminDashboard() {
  const [userStats, setUserStats] = useState({});
  const [consignments, setConsignments] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = () => {
    setLoading(true);
    Promise.all([
      API.get('/admin/users/summary'),
      API.get('/consignments/all'),
      API.get('/trucks/all')
    ])
      .then(([userRes, consignmentRes, truckRes]) => {
        setUserStats(userRes.data);
        setConsignments(consignmentRes.data.consignments || []);
        setTrucks(truckRes.data.trucks || []);
      })
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const countByStatus = status =>
    consignments.filter(c => c.status === status).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6"
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Admin Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-blue-600 text-center text-lg animate-pulse">
          Loading dashboard data...
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* User Summary */}
            <div
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition cursor-pointer border-l-4 border-blue-500"
              title="View user details"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">👥 Users</h2>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>Customers: <span className="font-medium">{userStats.customers}</span></li>
                <li>Drivers: <span className="font-medium">{userStats.drivers}</span></li>
                <li>Managers: <span className="font-medium">{userStats.managers}</span></li>
              </ul>
            </div>

            {/* Consignment Summary */}
            <div
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition cursor-pointer border-l-4 border-yellow-500"
              title="View consignments"
            >
              <h2 className="text-xl font-semibold text-yellow-700 mb-2">📦 Consignments</h2>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>Pending: <span className="font-medium">{countByStatus('pending')}</span></li>
                <li>Dispatched: <span className="font-medium">{countByStatus('dispatched')}</span></li>
                <li>Delivered: <span className="font-medium">{countByStatus('delivered')}</span></li>
              </ul>
            </div>

            {/* Truck Summary */}
            <div
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition cursor-pointer border-l-4 border-green-500"
              title="View trucks"
            >
              <h2 className="text-xl font-semibold text-green-700 mb-2">🚚 Trucks</h2>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>Idle: <span className="font-medium">{trucks.filter(t => t.status === 'idle').length}</span></li>
                <li>In-Transit: <span className="font-medium">{trucks.filter(t => t.status === 'in-transit').length}</span></li>
                <li>Total Trucks: <span className="font-medium">{trucks.length}</span></li>
              </ul>
            </div>
          </div>

          {/* User Management Table */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🛠️ User Management</h2>
            <UserManagement />
          </div>
        </>
      )}
    </motion.div>
  );
}

export default AdminDashboard;
