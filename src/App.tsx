import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManageStocks from './pages/ManageStocks';
import SlotBooking from './pages/SlotBooking';
import ManageSlots from './pages/ManageSlots';
import QRScanPage from './pages/QRScanPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/stocks" element={<ManageStocks />} />
        <Route path="/slots" element={<SlotBooking />} />
        <Route path="/admin/slots" element={<ManageSlots />} />
        <Route path="/admin/scan" element={<QRScanPage />} />
      </Routes>
    </div>
  );
}

export default App;
