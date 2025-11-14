import { useEffect, useState } from 'react';
import API from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

function CustomerDashboard() {
  const [form, setForm] = useState({
    volume: '',
    destination: ''
  });

  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchConsignments = () => {
    setLoading(true);
    API.get('/consignments/all')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.consignments;
        setConsignments(data || []);
      })
      .catch(err => {
        console.error('Fetch error:', err.response?.data || err.message);
        if (err.response?.status === 401) {
          toast.error('Session expired. Redirecting to login...');
          setTimeout(() => (window.location.href = '/login'), 2000);
        } else {
          toast.error('Failed to load consignments');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      toast.error('Please log in again.');
      window.location.href = '/login';
      return;
    }
    fetchConsignments();
    const interval = setInterval(fetchConsignments, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    const volumeNum = Number(form.volume);

    if (!form.destination || !form.volume) {
      toast.error('Please fill all required fields');
      return;
    }
    if (isNaN(volumeNum) || volumeNum <= 0 || volumeNum > 500) {
      toast.error('Volume must be between 1 and 500');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await API.post(
        '/consignments/submit',
        {
          sender: localStorage.getItem('userId'),
          volume: volumeNum,
          destination: form.destination
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Consignment submitted!');
      setForm({ volume: '', destination: '' });
      fetchConsignments();
    } catch (err) {
      console.error('Submission error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error('Session expired. Redirecting to login...');
        setTimeout(() => (window.location.href = '/login'), 2000);
      } else {
        toast.error(err.response?.data?.error || 'Submission failed');
      }
    }
  };

  const filteredConsignments =
    statusFilter === 'all'
      ? consignments
      : consignments.filter(c => c.status === statusFilter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-gray-100 to-green-50 p-6"
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h1 className="text-3xl font-bold text-green-700 mb-6">Customer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Submit Form */}
        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-4">📦 Submit New Consignment</h2>

          <input
            type="text"
            placeholder="Destination"
            className="border p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.destination}
            onChange={e => setForm({ ...form, destination: e.target.value })}
          />
          <input
            type="number"
            placeholder="Volume (≤ 500)"
            className="border p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.volume}
            onChange={e => setForm({ ...form, volume: e.target.value })}
          />

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full"
          >
            🚚 Submit
          </button>
        </div>

        {/* My Requests */}
        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">📋 My Consignments</h2>
            <button
              onClick={fetchConsignments}
              className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              🔄 Refresh
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="mb-4 p-2 border rounded w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="delayed">Delayed</option>
          </select>

          {loading ? (
            <p className="text-green-600">Loading...</p>
          ) : filteredConsignments.length === 0 ? (
            <p className="text-gray-500 italic">No consignments match this filter.</p>
          ) : (
            <ul className="space-y-4">
              {filteredConsignments.map(item => (
                <li key={item._id} className="border rounded-lg p-3 shadow-sm bg-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-green-800">{item.destination}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded text-white transition ${
                        item.status === 'pending'
                          ? 'bg-yellow-500'
                          : item.status === 'dispatched'
                          ? 'bg-blue-500'
                          : item.status === 'delivered'
                          ? 'bg-green-600'
                          : item.status === 'delayed'
                          ? 'bg-red-600'
                          : 'bg-gray-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Volume: {item.volume}</div>
                  <div className="text-xs text-gray-400">
                    Submitted: {new Date(item.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default CustomerDashboard;
