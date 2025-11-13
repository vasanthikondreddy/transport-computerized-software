import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';

function Login() {
  const [form, setForm] = useState({ email: '', password: '', role: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    if (!form.email || !form.password || !form.role) {
      toast.error('Please fill in all fields including role.');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('name', user.name);
      localStorage.setItem('userId', user._id);
      setUser(user);
      toast.success(`Welcome back, ${user.name}!`);

      switch (user.role) {
        case 'admin': navigate('/admin'); break;
        case 'branchManager': navigate('/manager'); break;
        case 'driver': navigate('/driver'); break;
        case 'customer': navigate('/customer'); break;
        default: navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a1c4fd] via-[#c2e9fb] to-[#d4fc79] animate-gradient-x px-4">
      <div className="bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl p-8 w-full max-w-md transition-all duration-300 hover:scale-[1.01] animate-fade-in ring-1 ring-white/40 ring-inset">
        {/* Logo */}
      

        <h2 className="text-4xl font-extrabold text-center text-[#0b2a5b] mb-8 drop-shadow-md tracking-wide">
          🚀 Login to TCC
        </h2>

        {/* Email Field */}
        <div className="relative mb-6">
          <FaEnvelope className="absolute left-4 top-4 text-[#0b2a5b]" />
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="peer w-full bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl px-12 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-[#0b2a5b] transition-all"
            placeholder=" "
          />
          <label className="absolute left-12 top-2 text-sm text-[#0b2a5b] peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all duration-200">
            Email
          </label>
        </div>

        {/* Password Field */}
        <div className="relative mb-6">
          <FaLock className="absolute left-4 top-4 text-[#0b2a5b]" />
          <input
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="peer w-full bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl px-12 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-[#0b2a5b] transition-all"
            placeholder=" "
          />
          <label className="absolute left-12 top-2 text-sm text-[#0b2a5b] peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all duration-200">
            Password
          </label>
        </div>

        {/* Role Selector */}
        <div className="relative mb-6">
          <FaUserShield className="absolute left-4 top-4 text-[#0b2a5b]" />
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="w-full bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#0b2a5b] transition-all hover:bg-white/90 hover:shadow-md"
          >
            <option value="">🎭 Select Role</option>
            <option value="admin">🛠️ Admin – Full control</option>
            <option value="branchManager">🏢 Branch Manager – Manage branches</option>
            <option value="driver">🚚 Driver – Deliver consignments</option>
            <option value="customer">👤 Customer – Book & track</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 transform ${
            loading
              ? 'bg-[#0b2a5b]/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#0b2a5b] to-[#2563eb] hover:from-[#2563eb] hover:to-[#0b2a5b] shadow-lg hover:shadow-xl hover:-translate-y-0.5'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-700">
          Don’t have an account?{' '}
          <Link to="/register" className="text-[#0b2a5b] font-semibold hover:underline">
            Register here
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
          animation: gradient-x 12s ease infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Login;
