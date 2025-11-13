import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.role) {
      toast.error('Please fill in all fields including role.');
      return;
    }

    setLoading(true);
    try {
      await API.post('/auth/register', form);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-300 via-white to-green-200 animate-gradient-x px-4">
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-8 w-full max-w-md transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-4xl font-bold text-center text-green-800 mb-6 drop-shadow-md">
          Create Your Account
        </h2>
        {error && <p className="text-red-600 text-center mb-4 font-medium">{error}</p>}

        {/* Floating Input Fields */}
        {['name', 'email', 'password'].map((field, idx) => (
          <div key={idx} className="relative mb-6">
            <input
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              className="peer w-full bg-white/70 backdrop-blur-sm border border-gray-300 rounded-lg px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-sm text-gray-600 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
          </div>
        ))}

        {/* Role Selector */}
        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          className="w-full bg-white/70 backdrop-blur-sm border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
        >
          <option value="">Select Role</option>
          <option value="driver">🚚 Driver – Deliver consignments</option>
          <option value="branchManager">🏢 Branch Manager – Oversee operations</option>
          <option value="customer">👤 Customer – Book and track shipments</option>
          <option value="admin">🛠️ Admin – Full platform control</option>
        </select>

        {/* Submit Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
            loading
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
          }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{' '}
          <Link to="/login" className="text-green-700 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>

      {/* Tailwind animation extension */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 10s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default Register;
