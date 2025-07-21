import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, Users, UserCog, QrCode } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to E-Ration System</h1>
          <p className="text-xl mb-8">Digitizing ration distribution with QR code technology</p>
          <div className="flex justify-center space-x-4">
            <Link to="/login" className="bg-white text-green-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition">
              User Login
            </Link>
            <Link to="/admin/login" className="bg-green-700 text-white px-6 py-2 rounded-md font-medium hover:bg-green-800 transition">
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <QrCode size={48} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">QR Code Generation</h3>
            <p className="text-gray-600">Generate unique QR codes for easy ration collection at distribution centers</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <Users size={48} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">User Management</h3>
            <p className="text-gray-600">Easy registration and document verification for eligible citizens</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBasket size={48} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Stock Management</h3>
            <p className="text-gray-600">Efficient inventory tracking and price management for administrators</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mb-4">1</div>
              <h3 className="text-lg font-semibold mb-2">Register</h3>
              <p className="text-gray-600">Create an account and upload required documents</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mb-4">2</div>
              <h3 className="text-lg font-semibold mb-2">Verification</h3>
              <p className="text-gray-600">Admin verifies your documents and approves your account</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mb-4">3</div>
              <h3 className="text-lg font-semibold mb-2">Get QR Code</h3>
              <p className="text-gray-600">Generate your unique QR code from your dashboard</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mb-4">4</div>
              <h3 className="text-lg font-semibold mb-2">Collect Ration</h3>
              <p className="text-gray-600">Visit your local ration shop and scan your QR code</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 E-Ration System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;