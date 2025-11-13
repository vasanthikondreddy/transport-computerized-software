import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManagerSummaryCards = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('/dashboard/summary')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return null;

  const statusKeys = ['Pending', 'Dispatched', 'Delivered', 'Delayed'];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statusKeys.map((key, i) => (
        <Card key={i} title={key} value={stats[key.toLowerCase()]} />
      ))}
      <Card title="Total Consignments" value={stats.totalConsignments} />
      <Card title="Total Trucks" value={stats.totalTrucks} />
      <Card title="Avg Waiting Time (hrs)" value={stats.avgWaitingTime} />
      <Card title="Avg Idle Time (hrs)" value={stats.avgIdleTime} />
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white shadow rounded p-4 text-center">
    <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
    <p className="text-2xl font-bold text-blue-700">{value ?? '—'}</p>
  </div>
);

export default ManagerSummaryCards;
