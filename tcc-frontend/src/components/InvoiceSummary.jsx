import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';

const InvoiceSummary = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await API.get('/invoices/all');
        setInvoices(res.data.invoices || []);
      } catch (err) {
        console.error('Invoice fetch error:', err.response?.data || err.message);
        toast.error('Failed to load invoice summary');
      }
    };
    fetchInvoices();
  }, []);

  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const paidCount = invoices.filter(inv => inv.status === 'paid').length;
  const unpaidCount = invoices.length - paidCount;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-20">
      <h2 className="text-lg font-semibold text-purple-700 mb-4">📊 Invoice Summary</h2>
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Total Invoices</span>
          <span className="font-bold">{invoices.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Amount</span>
          <span className="font-bold">₹{totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Paid</span>
          <span className="text-green-600 font-semibold">{paidCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Unpaid</span>
          <span className="text-red-600 font-semibold">{unpaidCount}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
