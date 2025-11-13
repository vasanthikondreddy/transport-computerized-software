import React, { useState } from 'react';

const ConsignmentFilter = ({ onFilter }) => {
  const [destination, setDestination] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const formatDate = (dateStr) => {
    const [yyyy, mm, dd] = dateStr.split('-'); // HTML date input gives yyyy-mm-dd
    return `${yyyy}-${mm}-${dd}`;
  };

  const applyFilter = () => {
    const payload = {};
    if (destination) payload.destination = destination;
    if (status) payload.status = status.toLowerCase(); // match backend enum
    if (fromDate) payload.fromDate = formatDate(fromDate);
    if (toDate) payload.toDate = formatDate(toDate);
    onFilter(payload);
  };

  const resetFilter = () => {
    setDestination('');
    setStatus('');
    setFromDate('');
    setToDate('');
    onFilter({});
  };

  return (
    <div className="bg-gray-100 p-4 rounded mb-6 shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">🔍 Filter Consignments</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="dispatched">Dispatched</option>
          <option value="delivered">Delivered</option>
        </select>
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={applyFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Apply
        </button>
        <button
          onClick={resetFilter}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ConsignmentFilter;
