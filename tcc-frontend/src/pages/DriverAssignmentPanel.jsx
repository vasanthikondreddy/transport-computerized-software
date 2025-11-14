import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function DriverAssignmentPanel() {
  const [drivers, setDrivers] = useState([]);
  const [consignments, setConsignments] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedConsignment, setSelectedConsignment] = useState('');

  useEffect(() => {
    axios.get('/manager/drivers').then(res => setDrivers(res.data));
    axios.get('/manager/consignments').then(res => setConsignments(res.data));
  }, []);

  const handleAssign = async () => {
    try {
      await axios.post('/manager/assign-driver', {
        driverId: selectedDriver,
        consignmentId: selectedConsignment,
      });
      toast.success('Driver assigned successfully!');
    } catch (err) {
      toast.error('Assignment failed');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Assign Driver to Consignment</h2>
      <div className="space-y-4">
        <select value={selectedDriver} onChange={e => setSelectedDriver(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Select Driver</option>
          {drivers.map(driver => (
            <option key={driver._id} value={driver._id}>{driver.name}</option>
          ))}
        </select>

        <select value={selectedConsignment} onChange={e => setSelectedConsignment(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Select Consignment</option>
          {consignments.map(c => (
            <option key={c._id} value={c._id}>{c.destination} ({c.status})</option>
          ))}
        </select>

        <button onClick={handleAssign} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Assign Driver
        </button>
      </div>
    </div>
  );
}
