import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AssignTruck = () => {
  const [trucks, setTrucks] = useState([]);
  const [consignments, setConsignments] = useState([]);
  const [selectedConsignment, setSelectedConsignment] = useState('');
  const [selectedTruck, setSelectedTruck] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [truckRes, consignmentRes] = await Promise.all([
        axios.get('/trucks', { withCredentials: true }),
        axios.get('/consignments/unassigned', { withCredentials: true }),
      ]);
      setTrucks(truckRes.data);
      setConsignments(consignmentRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    }
  };

  const handleAssign = async () => {
    if (!selectedConsignment || !selectedTruck) {
      toast.error('Please select both consignment and truck');
      return;
    }

    try {
      await axios.patch(
        `/consignments/assign/${selectedConsignment}`,
        { truckId: selectedTruck },
        { withCredentials: true }
      );

      await axios.patch(`/trucks/update-usage/${selectedTruck}`, {}, { withCredentials: true });

      toast.success('Truck assigned and usage updated');
      fetchData(); // Refresh lists
      setSelectedConsignment('');
      setSelectedTruck('');
    } catch (err) {
      toast.error('Assignment failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Assign Truck to Consignment</h2>

      <div className="mb-4">
        <label className="block mb-1">Select Consignment:</label>
        <select
          value={selectedConsignment}
          onChange={(e) => setSelectedConsignment(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">-- Select --</option>
          {consignments.map((c) => (
            <option key={c._id} value={c._id}>
              {c._id} — {c.volume} m³
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Select Truck:</label>
        <select
          value={selectedTruck}
          onChange={(e) => setSelectedTruck(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">-- Select --</option>
          {trucks.map((t) => (
            <option key={t._id} value={t._id}>
              {t._id} — {t.capacity} m³
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAssign}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Assign Truck
      </button>
    </div>
  );
};

export default AssignTruck;
