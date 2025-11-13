import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ManagerSummaryCards from '../components/ManagerSummaryCards';
import TruckManagement from '../components/TruckManagement';
import TruckOverview from '../components/TruckOverview';
import InvoiceForm from '../components/InvoiceForm';
import InvoiceSummary from '../components/InvoiceSummary';
import { toast, ToastContainer } from 'react-toastify';
import BranchForm from '../components/BranchForm';

import 'react-toastify/dist/ReactToastify.css';

const ManagerDashboard = () => {
  const [trucks, setTrucks] = useState([]);
  const [consignments, setConsignments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
   const [branches, setBranches] = useState([]);
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'branchManager') {
      window.location.href = '/unauthorized';
    }
  }, []);

const fetchBranches = async () => {
  try {
    const res = await axios.get('/branches/all');
    setBranches(res.data.branches || []);
  } catch {
    toast.error('Failed to load branches');
  }
};
  const fetchTrucks = async () => {
    try {
      const res = await axios.get('/trucks/all');
      setTrucks(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to load trucks');
    }
  };

  const fetchConsignments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/consignments/all');
      const data = Array.isArray(res.data.consignments) ? res.data.consignments : [];
      setConsignments(data);
    } catch {
      toast.error('Failed to load consignments');
    } finally {
      setLoading(false);
    }
  };
const fetchInvoices = async () => {
  try {
    const res = await axios.get('/invoices/all');
    setInvoices(res.data.invoices || []);
  } catch {
    toast.error('Failed to load invoices');
  }
};

  const handleStatusChange = (id, newStatus) => {
    setStatusUpdates(prev => ({ ...prev, [id]: newStatus }));
  };
const markInvoicePaid = async (id) => {
  try {
    await axios.patch(`/invoices/pay/${id}`, { paymentMethod: 'UPI' });
    toast.success('Invoice marked as paid');
    fetchInvoices();
  } catch {
    toast.error('Failed to update invoice');
  }
};

  const updateStatus = async (id) => {
    const newStatus = statusUpdates[id];
    if (!newStatus) return;

    try {
      await axios.put(`/consignments/update-status/${id}`, { status: newStatus });
      toast.success('Status updated');
      fetchConsignments();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filteredConsignments = statusFilter === 'all'
    ? consignments
    : consignments.filter(c => c.status === statusFilter);

  useEffect(() => {
    fetchTrucks();
    fetchConsignments();
    fetchInvoices();
      fetchBranches();
  }, []);

 return (
  <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
    <ToastContainer position="top-right" autoClose={3000} />
    <h1 className="text-3xl font-bold mb-6 text-blue-700">📋 Manager Dashboard</h1> 
    

    <ManagerSummaryCards />
    <TruckManagement onTruckAdded={fetchTrucks} />
    <InvoiceForm
  onInvoiceCreated={fetchInvoices}
  branches={branches}
/>

   
<BranchForm onBranchCreated={fetchBranches} />
<InvoiceSummary invoices={invoices} />
    {/* 🚚 Consignment Status Section */}
    <div className="mt-10 bg-white p-6 rounded-lg shadow-lg border border-blue-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-600">🛠️ Manage Consignment Status</h2>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-blue-300 px-3 py-1 rounded text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading consignments...</p>
      ) : filteredConsignments.length === 0 ? (
        <p className="text-gray-500 italic">No consignments match your filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="p-3 border">Destination</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Truck</th>
                <th className="p-3 border">Volume</th>
                <th className="p-3 border">Submitted</th>
                <th className="p-3 border">Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredConsignments.map(c => (
                <tr key={c._id} className="hover:bg-blue-50 transition">
                  <td className="p-3 border">{c.destination}</td>
                  <td className="p-3 border">
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      c.status === 'pending' ? 'bg-yellow-500' :
                      c.status === 'in-transit' ? 'bg-blue-500' :
                      c.status === 'delivered' ? 'bg-green-600' : 'bg-gray-400'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 border">{c.truck?.number || '—'}</td>
                  <td className="p-3 border">{c.volume}</td>
                  <td className="p-3 border text-xs text-gray-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 border">
                    <div className="flex items-center gap-2">
                      <select
                        value={statusUpdates[c._id] || c.status}
                        onChange={e => handleStatusChange(c._id, e.target.value)}
                        className="border px-2 py-1 rounded text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                      </select>
                      <button
                        onClick={() => updateStatus(c._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

  
  </div>
);

};

export default ManagerDashboard;
