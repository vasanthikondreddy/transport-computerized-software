import { useState, useEffect } from 'react';
import AuthContext from './AuthContext';

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    if (role && token) {
      setUser({ role, token, name });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
