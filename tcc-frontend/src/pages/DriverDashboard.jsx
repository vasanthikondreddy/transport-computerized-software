import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DriverDashboard = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchConsignments = async () => {
    setLoading(true);
    try {
      const res = await API.get('consignments/driver/consignments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const data = Array.isArray(res.data) ? res.data : res.data.consignments || res.data;
      console.log("Fetched consignments:", data);
      setConsignments(data);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to load consignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsignments(); 
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-green-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-green-700">🚚 Driver Dashboard</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={fetchConsignments}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading consignments...</p>
      ) : consignments.length === 0 ? (
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
    </div>
  );
};

export default DriverDashboard;
