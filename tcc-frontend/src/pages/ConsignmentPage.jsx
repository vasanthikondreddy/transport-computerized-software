// src/pages/ConsignmentForm.jsx
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/useAuth';

function ConsignmentForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    volume: '',
    destination: '',
    receiverName: '',
    receiverAddress: '',
    receiverContact: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        sender: user._id,
        volume: Number(form.volume),
        destination: form.destination,
        receiver: {
          name: form.receiverName,
          address: form.receiverAddress,
          contact: form.receiverContact
        }
      };

      await axios.post('/consignments', payload);
      toast.success('Consignment created successfully!');
      setForm({ volume: '', destination: '', receiverName: '', receiverAddress: '', receiverContact: '',capacity:'' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create consignment');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#0b2a5b]">New Consignment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="number" placeholder="Volume (m³)" value={form.volume}
          onChange={e => setForm({ ...form, volume: e.target.value })}
          className="w-full border p-3 rounded-lg" required />

        <input type="text" placeholder="Destination City" value={form.destination}
          onChange={e => setForm({ ...form, destination: e.target.value })}
          className="w-full border p-3 rounded-lg" required />

        <input type="text" placeholder="Receiver Name" value={form.receiverName}
          onChange={e => setForm({ ...form, receiverName: e.target.value })}
          className="w-full border p-3 rounded-lg" required />

        <input type="text" placeholder="Receiver Address" value={form.receiverAddress}
          onChange={e => setForm({ ...form, receiverAddress: e.target.value })}
          className="w-full border p-3 rounded-lg" required />

        <input type="text" placeholder="Receiver Contact" value={form.receiverContact}
          onChange={e => setForm({ ...form, receiverContact: e.target.value })}
          className="w-full border p-3 rounded-lg" />

        <button type="submit"
          className="w-full bg-[#0b2a5b] text-white py-3 rounded-lg hover:bg-blue-900 transition">
          Submit Consignment
        </button>
      </form>
    </div>
  );
}

export default ConsignmentForm;
