import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate();
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.role;

    if (role) {
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'branchManager':
          navigate('/manager');
          break;
        case 'driver':
          navigate('/driver');
          break;
        case 'customer':
          navigate('/customer');
          break;
        default:
          navigate('/login');
      }
    } else {
      setCheckingRole(false);
    }
  }, [navigate]);

  if (checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <motion.p
          className="text-blue-600 text-lg font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Redirecting to your dashboard...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex flex-col items-center justify-center text-center px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-4 drop-shadow-sm"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to TCCS Logistics
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        A unified platform to streamline consignments, trucks, and logistics across rural and urban regions.
      </motion.p>

      <div className="flex gap-6 flex-wrap justify-center mb-10">
        <Link
          to="/login"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 text-lg shadow-md"
          aria-label="Login to your account"
        >
          <FaSignInAlt />
          Login
        </Link>
        <Link
          to="/register"
          className="flex items-center gap-2 bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300 text-lg shadow-md"
          aria-label="Register a new account"
        >
          <FaUserPlus />
          Register
        </Link>
      </div>
<motion.img
  src="public/assets/About Digital TMS .png"
  alt="Illustration of logistics coordination"
  className="w-1/3 max-w-md mt-4 drop-shadow-lg"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.5, duration: 0.8 }}
/>
    </motion.div>
  );
}
