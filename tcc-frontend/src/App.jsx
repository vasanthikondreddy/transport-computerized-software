import { Routes, Route } from 'react-router-dom';
import DriverDashboard from './pages/DriverDashboard.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './pages/ProtectedRoutes.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Layout from './components/Layout.jsx';
import Navbar from './components/Navbar.jsx';
import RoleRedirect from './pages/RoleRedirect.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home.jsx';
import ConsignmentForm from './pages/ConsignmentPage.jsx';
function App() {
  return (
    <>
      <Navbar />
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/" element={<RoleRedirect />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/driver" element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
         <Route path="/manager" element={
  <ProtectedRoute allowedRoles={['branchManager']}>
    <ManagerDashboard />
  </ProtectedRoute>
} />
<Route path="/consignments/new" element={<ConsignmentForm />} />

          <Route path="/customer" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={
            <h1 className="text-center text-red-500 mt-10 text-xl font-semibold">
              404 - Page Not Found
            </h1>
          } />
        </Routes>
      </Layout>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Footer />
    </>
  );
}

export default App;
