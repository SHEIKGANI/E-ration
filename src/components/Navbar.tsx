import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShoppingBasket, Calendar, HelpCircle, Menu, X, Scan, BarChart3 } from 'lucide-react';
import HelpPopup from './HelpPopup';

const Navbar: React.FC = () => {
  const { user, admin, logout } = useAuth();
  const location = useLocation();
  const [showHelp, setShowHelp] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const getHelpContext = () => {
    if (location.pathname.includes('login') || location.pathname.includes('register')) return 'login';
    if (location.pathname.includes('slot')) return 'booking';
    if (location.pathname.includes('dashboard') && user) return 'qr';
    return undefined;
  };

  return (
    <>
      <nav className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBasket size={24} />
              <span className="text-xl font-bold">E-Ration System</span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {!user && !admin && (
                <>
                  <Link 
                    to="/login" 
                    className={`hover:text-green-200 transition-colors ${
                      location.pathname === '/login' ? 'text-green-200 font-medium' : ''
                    }`}
                  >
                    User Login
                  </Link>
                  <Link 
                    to="/admin/login" 
                    className={`hover:text-green-200 transition-colors ${
                      location.pathname === '/admin/login' ? 'text-green-200 font-medium' : ''
                    }`}
                  >
                    Admin Login
                  </Link>
                </>
              )}
              
              {user && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`hover:text-green-200 transition-colors ${
                      location.pathname === '/dashboard' ? 'text-green-200 font-medium' : ''
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/slots" 
                    className={`hover:text-green-200 flex items-center transition-colors ${
                      location.pathname === '/slots' ? 'text-green-200 font-medium' : ''
                    }`}
                  >
                    <Calendar size={16} className="mr-1" />
                    Book Slot
                  </Link>
                </>
              )}
              
              {admin && (
                <>
                  <Link 
                    to="/admin/dashboard" 
                    className={`hover:text-green-200 flex items-center transition-colors ${
                      location.pathname === '/admin/dashboard' ? 'text-green-200 font-medium' : ''
                    }`}
                  >
                    <BarChart3 size={16} className="mr-1" />
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/scan" 
                    className={`hover:text-green-200 flex items-center transition-colors ${
                      location.pathname === '/admin/scan' ? 'text-green-200 font-medium' : ''
                    }`}
                  >
                    <Scan size={16} className="mr-1" />
                    QR Scanner
                  </Link>
                  <Link 
                    to="/admin/stocks" 
                    className={`hover:text-green-200 transition-colors ${
                      location.pathname === '/admin/stocks' ? 'text-green-200 font-medium' : ''
                    }`}
                  >
                    Manage Stocks
                  </Link>
                  <Link 
                    to="/admin/slots" 
                    className={`hover:text-green-200 flex items-center transition-colors ${
                      location.pathname === '/admin/slots' ? 'text-green-200 font-medium' : ''
                    }`}
                  >
                    <Calendar size={16} className="mr-1" />
                    Slots
                  </Link>
                </>
              )}
              
              {/* Help Button */}
              <button
                onClick={() => setShowHelp(true)}
                className="hover:text-green-200 flex items-center transition-colors"
                title="Get Help"
              >
                <HelpCircle size={18} />
                <span className="ml-1 hidden lg:inline">Help</span>
              </button>
              
              {(user || admin) && (
                <button 
                  onClick={logout} 
                  className="flex items-center space-x-1 hover:text-green-200 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setShowHelp(true)}
                className="hover:text-green-200 transition-colors"
                title="Get Help"
              >
                <HelpCircle size={20} />
              </button>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="hover:text-green-200 transition-colors"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 border-t border-green-500">
              <div className="flex flex-col space-y-2 mt-4">
                {!user && !admin && (
                  <>
                    <Link 
                      to="/login" 
                      className="block py-2 hover:text-green-200 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      User Login
                    </Link>
                    <Link 
                      to="/admin/login" 
                      className="block py-2 hover:text-green-200 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Admin Login
                    </Link>
                  </>
                )}
                
                {user && (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="block py-2 hover:text-green-200 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/slots" 
                      className="block py-2 hover:text-green-200 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Book Slot
                    </Link>
                  </>
                )}
                
                {admin && (
                  <>
                    <Link 
                      to="/admin/dashboard" 
                      className="block py-2 hover:text-green-200 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <Link 
                      to="/admin/scan" 
                      className="block py-2 hover:text-green-200 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      QR Scanner
                    </Link>
                    <Link 
                      to="/admin/stocks" 
                      className="block py-2 hover:text-green-200 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Manage Stocks
                    </Link>
                    <Link 
                      to="/admin/slots" 
                      className="block py-2 hover:text-green-200 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Manage Slots
                    </Link>
                  </>
                )}
                
                {(user || admin) && (
                  <button 
                    onClick={() => {
                      logout();
                      setShowMobileMenu(false);
                    }}
                    className="text-left py-2 hover:text-green-200 transition-colors"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Help Popup */}
      <HelpPopup
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        context={getHelpContext()}
      />
    </>
  );
};

export default Navbar;
