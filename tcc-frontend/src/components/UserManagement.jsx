import { useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    API.get('/admin/users')
      .then(res => setUsers(res.data.users || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      setUsers(prev => prev.filter(user => user._id !== id));
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <h2 className="text-xl font-semibold mb-4">👥 User Management</h2>
      {loading ? (
        <p className="text-blue-600">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500 italic">No users found.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead className="bg-blue-100 text-left text-sm font-semibold">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="hover:bg-blue-50">
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border capitalize">{user.role}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserManagement;
