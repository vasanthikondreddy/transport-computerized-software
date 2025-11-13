import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RoleRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const redirectMap = {
      admin: '/admin',
      branchManager: '/manager',
      driver: '/driver',
      customer: '/customer',
    };

    const path = redirectMap[role] || '/login';
    console.log('Role:', role);
    console.log('Redirecting to:', path);
    navigate(path);
  }, [navigate]);

  return null;
}

export default RoleRedirect;
