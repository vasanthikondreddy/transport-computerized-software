import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FinanceDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get('/invoices?status=pending');
        setInvoices(res.data);
      } catch (err) {
        console.error('Error fetching invoices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // Approve or reject invoice
  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      await axios.patch(`/invoices/${invoiceId}/status`, { status: newStatus });
      setInvoices(prev =>
        prev.map(inv => (inv._id === invoiceId ? { ...inv, status: newStatus } : inv))
      );
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Finance Dashboard</h1>

      {loading ? (
        <p>Loading invoices...</p>
      ) : (
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead className="bg-green-600 text-white">
            <tr>
              <th>Invoice ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv._id} className="text-center border-b">
                <td>{inv._id}</td>
                <td>{inv.customer_name}</td>
                <td>₹{inv.amount}</td>
                <td>{inv.status}</td>
                <td>
                  <button
                    onClick={() => updateInvoiceStatus(inv._id, 'Approved')}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateInvoiceStatus(inv._id, 'Rejected')}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FinanceDashboard;
