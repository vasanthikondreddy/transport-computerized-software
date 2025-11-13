import { useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';

function TruckManagement() {
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [capacity, setCapacity] = useState('');
const [branches, setBranches] = useState([]);
const [selectedBranch, setSelectedBranch] = useState(''); 
  // Form state
  const [location, setLocation] = useState('');
  const [number, setNumber] = useState('');
  const [assignedDriver, setAssignedDriver] = useState('');

  // Filters
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchTrucks = () => {
    API.get('/trucks/all')
      .then(res => setTrucks(res.data.trucks || []))
      .catch(() => toast.error('Failed to load trucks'))
      .finally(() => setLoading(false));
  };

  const fetchDrivers = () => {
    API.get('auth/unassigned-drivers')
      .then(res => setDrivers(res.data.users || []))
      .catch(() => toast.error('Failed to load drivers'));
  };
const fetchBranches = () => {
  API.get('/branches/all')
    .then(res => setBranches(res.data.branches || []))
    .catch(() => toast.error('Failed to load branches'));
};
  useEffect(() => {
    fetchTrucks();
    fetchDrivers();
    fetchBranches();
  }, []);

 const handleAdd = async () => {
  if (!location.trim() || !number.trim() || !capacity.trim()) {
    return toast.warn('Truck number, location, and capacity are required');
  }
  try {
    const res = await API.post('/trucks/add', {
      location,
      number,
      assignedDriver,
      capacity: Number(capacity), // ✅ Include inside the payload
 
  branch: selectedBranch
    });
    toast.success('Truck added');
    setTrucks(prev => [...prev, res.data.truck]);
    setLocation('');
    setNumber('');
    setAssignedDriver('');
    setCapacity(''); // ✅ Reset capacity
    fetchDrivers();
  } catch {
    toast.error('Failed to add truck');
  }
};

  const handleDelete = async id => {
    if (!window.confirm('Delete this truck?')) return;
    try {
      await API.delete(`/trucks/${id}`);
      toast.success('Truck deleted');
      setTrucks(prev => prev.filter(t => t._id !== id));
      fetchDrivers();
    } catch {
      toast.error('Failed to delete truck');
    }
  };

  const filteredTrucks = trucks.filter(truck => {
    const locationMatch = filterLocation ? truck.location.toLowerCase().includes(filterLocation.toLowerCase()) : true;
    const statusMatch = filterStatus ? truck.status === filterStatus : true;
    return locationMatch || statusMatch;
  });

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">🚚 Truck Management</h2>

      {/* Add Truck Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          value={number}
          onChange={e => setNumber(e.target.value)}
          placeholder="Enter truck number"
          className="border border-blue-300 px-4 py-2 rounded-lg"
        />
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Enter truck location"
          className="border border-blue-300 px-4 py-2 rounded-lg"
        />
        <input
  type="number"
  value={capacity}
  onChange={e => setCapacity(e.target.value)}
  placeholder="Enter truck capacity (m³)"
  className="border border-blue-300 px-4 py-2 rounded-lg"
/>

        <select
          value={assignedDriver}
          onChange={e => setAssignedDriver(e.target.value)}
          className="md:col-span-2 border border-blue-300 px-4 py-2 rounded-lg"
        >
          <option value="">Select driver</option>
          {drivers.map(driver => (
            <option key={driver._id} value={driver._id}>
              {driver.name}
            </option>
          ))}
        </select>
        <select
  value={selectedBranch}
  onChange={e => setSelectedBranch(e.target.value)}
  className="md:col-span-2 border border-blue-300 px-4 py-2 rounded-lg"
>
  <option value="">Select branch</option>
  {branches.map(branch => (
    <option key={branch._id} value={branch._id}>
      {branch.name}
    </option>
  ))}
</select>

        <button
          onClick={handleAdd}
          className="md:col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          ➕ Add Truck
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          value={filterLocation}
          onChange={e => setFilterLocation(e.target.value)}
          placeholder="Filter by location"
          className="border border-gray-300 px-4 py-2 rounded-lg"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg"
        >
          <option value="">Filter by status</option>
          <option value="available">Available</option>
          <option value="inTransit">In Transit</option>
          <option value="idle">Idle</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {/* Truck Table */}
      {loading ? (
        <p className="text-blue-600 font-medium">Loading trucks...</p>
      ) : filteredTrucks.length === 0 ? (
        <p className="text-gray-500 italic">No trucks match your filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="p-3 border">Number</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Volume</th>
                <th className="p-3 border">Last Used</th>
                <th className="p-3 border">Driver</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrucks.map(truck => (
                <tr key={truck._id} className="hover:bg-blue-50 transition">
                  <td className="p-3 border font-semibold text-blue-700">{truck.number || '—'}</td>
                  <td className="p-3 border">{truck.location}</td>
                  <td className="p-3 border capitalize">{truck.status}</td>
                  <td className="p-3 border">{truck.assignedVolume}</td>
                  <td className="p-3 border">{truck.lastUsed ? new Date(truck.lastUsed).toLocaleString() : '—'}</td>
                  <td className="p-3 border">{truck.assignedDriver?.name || '—'}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleDelete(truck._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TruckManagement;
