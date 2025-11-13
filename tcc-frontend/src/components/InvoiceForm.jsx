import React, { useState, useEffect } from 'react';
import API from '../services/api'; // your shared axios instance
import { toast } from 'react-toastify';

const InvoiceForm = ({ onInvoiceCreated }) => {
  const [consignments, setConsignments] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({
    consignment: '',
    truck: '',
    branch: '',
    customerName: '',
    amount: '',
    paymentMethod: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [consRes, truckRes, branchRes] = await Promise.all([
          API.get('/consignments/all'),
          API.get('/trucks/all'),
          API.get('/branches/all')
        ]);
        setConsignments(consRes.data.consignments || []);
        setTrucks(truckRes.data.trucks || []);
        setBranches(branchRes.data.branches || []);
      } catch (err) {
        toast.error('Failed to load form data');
        console.error('Form load error:', err.response?.data || err.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/invoices/create', form);
      toast.success('Invoice created');
      setForm({
        consignment: '',
        truck: '',
        branch: '',
        customerName: '',
        amount: '',
        paymentMethod: ''
      });
      if (onInvoiceCreated) onInvoiceCreated();
    } catch (err) {
      console.error('Invoice creation error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to create invoice');
    }
  };

  return (
    <div className="mt-10 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-purple-700 mb-4">🧾 Create Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="consignment"
          value={form.consignment}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Consignment</option>
          {consignments.map(c => (
            <option key={c._id} value={c._id}>{c.destination}</option>
          ))}
        </select>

        <select
          name="truck"
          value={form.truck}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Truck</option>
          {trucks.map(t => (
            <option key={t._id} value={t._id}>{t.number}</option>
          ))}
        </select>

        <select
          name="branch"
          value={form.branch}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Branch</option>
          {branches.map(b => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>

        <input
          type="text"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          placeholder="Customer Name"
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount (₹)"
          required
          className="w-full border px-3 py-2 rounded"
        />

        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Payment Method</option>
          <option value="UPI">UPI</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
        </select>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Create Invoice
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;
