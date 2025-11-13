import React, { useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';

const BranchForm = ({ onBranchCreated }) => {
  const [form, setForm] = useState({ name: '', location: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/branches/create', form);
      toast.success('Branch created');
      setForm({ name: '', location: '' });
      if (onBranchCreated) onBranchCreated();
    } catch {
      toast.error('Failed to create branch');
    }
  };

  return (
    <div className="mt-10 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-indigo-700 mb-4">🏢 Create Branch</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Branch Name"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Create Branch
        </button>
      </form>
    </div>
  );
};

export default BranchForm;
