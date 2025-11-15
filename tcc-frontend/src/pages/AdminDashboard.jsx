import { useEffect, useState } from 'react';
import API from '../services/api';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import UserManagement from '../components/UserManagement';
function AdminDashboard() { 
  const [userStats, setUserStats] = useState({});
  const [consignments, setConsignments] = useState([]); 
  const [trucks, setTrucks] = useState([]); 
  const [loading, setLoading] = useState(true);
   useEffect(() => {
     Promise.all([ API.get('/admin/users/summary'), 
      API.get('/consignments/all'), API.get('/trucks/all') ]) 
      .then(([userRes, consignmentRes, truckRes]) => { setUserStats(userRes.data);
      setConsignments(consignmentRes.data.consignments || []); 
      setTrucks(truckRes.data.trucks || []); })
      .catch(() => toast.error('Failed to load admin data')) 
      .finally(() => setLoading(false)); }, []); 
      const countByStatus = status => 
      consignments.filter(c => c.status === status).length;
       return (
         <motion.div initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }} 
          transition={{ duration: 0.4 }} 
          className="min-h-screen bg-gray-100 p-6" >
           <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <h1 className="text-3xl font-bold text-blue-700 mb-6">Admin Dashboard</h1> 
            {loading ? ( <p className="text-blue-600 text-center">Loading dashboard data...</p> 
            ) :
             ( <> <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* User Summary */}

              <div className="bg-white rounded-lg shadow p-4">
               <h2 className="text-xl font-semibold mb-2">👥 Users</h2>
                <ul className="text-gray-700 space-y-1"> 
                <li>Customers: {userStats.customers}</li>
                 <li>Drivers: {userStats.drivers}</li> 
                 <li>Managers: {userStats.managers}</li>
                  </ul> </div> {/* Consignment Summary */} <div className="bg-white rounded-lg shadow p-4">
                   <h2 className="text-xl font-semibold mb-2">📦 Consignments</h2>
                    <ul className="text-gray-700 space-y-1"> <li>Pending: {countByStatus('pending')}</li>
                     <li>Dispatched: {countByStatus('dispatched')}</li>
                      <li>Delivered: {countByStatus('delivered')}</li> </ul> 
                      </div> {/* Truck Summary */} <div className="bg-white rounded-lg shadow p-4"> 
                      <h2 className="text-xl font-semibold mb-2">🚚 Trucks</h2> <ul className="text-gray-700 space-y-1"> 
                      <li>Idle: {trucks.filter(t => t.status === 'idle').length}</li>
                       <li>In-Transit: {trucks.filter(t => t.status === 'in-transit').length}</li>
                        <li>Total Trucks: {trucks.length}</li> </ul> </div>
                         </div> {/* User Management Table */
                         } <UserManagement /> </> )}
                         </motion.div> );
                          }
                          export default AdminDashboard;