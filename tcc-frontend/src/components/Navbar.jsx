import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';
import { useState } from 'react';

function Navbar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!auth) {
    console.warn('Auth context not available');
    return null;
  }

  const { setUser, user } = auth;
  const name = user?.name || localStorage.getItem('name');
  const role = user?.role || localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
   <nav className="bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-400 text-white shadow-md px-4 py-2">

      <div className="flex justify-between items-center">
        
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold tracking-wide">🚚 TCC Platform</div>
          {name && (
            <div className="text-sm text-white/90 italic">
              Welcome, <span className="font-semibold">{name}</span>
              {role && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs uppercase tracking-wide">
                  {role}
                </span>
              )}
            </div>
          )}
        </div>

        
        <button
          className="md:hidden text-white focus:outline-none text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

     
      <div className={`mt-4 md:mt-0 ${menuOpen ? 'block' : 'hidden'} md:flex md:justify-end md:items-center`}>
        <div className="flex flex-col md:flex-row gap-3 text-sm font-medium">
          <Link to="/register" className="hover:text-yellow-200 transition">Register</Link>
          <Link to="/Admin" className="hover:text-yellow-200 transition">Admin</Link>
          <Link to="/customer" className="hover:text-yellow-200 transition">Customer</Link>
          <Link to="/driver" className="hover:text-yellow-200 transition">Driver</Link>
          <Link to="/manager" className="hover:text-yellow-200 transition">Manager</Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
