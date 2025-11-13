import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AssignDriver = ({ consignmentId, onAssigned }) => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    axios.get('/manager/drivers')
      .then(res => setDrivers(res.data))
      .catch(() => toast.error('Failed to load drivers'));
  }, []);

  const handleAssign = async () => {
    if (!selectedDriver) return toast.warning('Select a driver');
    setAssigning(true);
    try {
      await axios.post('/manager/assign-driver', {
        consignmentId,
        driverId: selectedDriver,
      });
      toast.success('Driver assigned');
      if (onAssigned) onAssigned();
    } catch {
      toast.error('Assignment failed');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedDriver}
        onChange={e => setSelectedDriver(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="">Select</option>
        {drivers.map(driver => (
          <option key={driver._id} value={driver._id}>{driver.name}</option>
        ))}
      </select>
      <button
        onClick={handleAssign}
        disabled={assigning}
        className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
      >
        Assign
      </button>
    </div>
  );
};

export default AssignDriver;
