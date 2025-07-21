import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShoppingBasket, Calendar } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, admin, logout } = useAuth();

  return (
    <nav className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <ShoppingBasket size={24} />
          <span className="text-xl font-bold">E-Ration System</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {!user && !admin && (
            <>
              <Link to="/login" className="hover:text-green-200">User Login</Link>
              <Link to="/admin/login" className="hover:text-green-200">Admin Login</Link>
            </>
          )}
          
          {user && (
            <>
              <Link to="/dashboard" className="hover:text-green-200">Dashboard</Link>
              <Link to="/slots" className="hover:text-green-200 flex items-center">
                <Calendar size={16} className="mr-1" />
                Book Slot
              </Link>
              <Link to="/profile" className="hover:text-green-200">Profile</Link>
            </>
          )}
          
          {admin && (
            <>
              <Link to="/admin/dashboard" className="hover:text-green-200">Admin Dashboard</Link>
              <Link to="/admin/stocks" className="hover:text-green-200">Manage Stocks</Link>
              <Link to="/admin/slots" className="hover:text-green-200 flex items-center">
                <Calendar size={16} className="mr-1" />
                Manage Slots
              </Link>
            </>
          )}
          
          {(user || admin) && (
            <button 
              onClick={logout} 
              className="flex items-center space-x-1 hover:text-green-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;