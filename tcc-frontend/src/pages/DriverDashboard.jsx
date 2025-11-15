import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DriverDashboard = () => {
  const [consignments, setConsignments] = useState([]);
  const [truck, setTruck] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await API.get('/driver/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setConsignments(res.data.consignments || []);
      setTruck(res.data.truckDetails || null);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-green-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-green-700">🚚 Driver Dashboard</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={fetchDashboard}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading dashboard...</p>
      ) : (
        <>
          {/* Truck Card */}
          {truck && (
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-green-700 mb-2">Your Truck</h2>
              <p className="text-gray-700">Number: {truck.number}</p>
              <p className="text-gray-700">Capacity: {truck.capacity}</p>
              <div className="mt-2">
                <label className="text-sm text-gray-600 mr-2">Status:</label>
                <select
                  value={truck.status}
                  onChange={async e => {
                    try {
                      const res = await API.put(`/driver/truck/${truck._id}/status`, { status: e.target.value });
                      setTruck(res.data.truck);
                      toast.success('Truck status updated');
                    } catch {
                      toast.error('Failed to update truck status');
                    }
                  }}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="idle">Idle</option>
                  <option value="in-transit">In-Transit</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          )}

          {/* Consignment Table */}
          {consignments.length === 0 ? (
            <p className="text-gray-500 italic">No consignments assigned to you.</p>
          ) : (
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
              <table className="w-full table-auto border-collapse text-sm">
                <thead className="bg-green-100 text-green-800">
                  <tr>
                    <th className="p-3 border">Destination</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Truck</th>
                    <th className="p-3 border">Volume</th>
                    <th className="p-3 border">Assigned On</th>
                  </tr>
                </thead>
                <tbody>
                  {consignments.map(c => (
                    <tr key={c._id} className="hover:bg-green-50 transition">
                      <td className="p-3 border">{c.destination}</td>
                      <td className="p-3 border">
                        <span className={`px-2 py-1 rounded text-white text-xs ${
                          c.status === 'pending' ? 'bg-yellow-500' :
                          c.status === 'in-transit' ? 'bg-blue-500' :
                          c.status === 'delivered' ? 'bg-green-600' :
                          c.status === 'delayed' ? 'bg-red-500' : 'bg-gray-400'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 border">{c.truck?.number || '—'}</td>
                      <td className="p-3 border">{c.volume}</td>
                      <td className="p-3 border">
                        {c.createdAt ? new Date(c.createdAt).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DriverDashboard;
