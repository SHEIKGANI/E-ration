import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useStock } from '../context/StockContext';
import { useSlot } from '../context/SlotContext';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { ShoppingBasket, QrCode, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { stocks } = useStock();
  const { getUserBooking } = useSlot();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Please login to access the dashboard</p>
      </div>
    );
  }

  const userBooking = getUserBooking();

  // Generate QR code data
  const qrData = JSON.stringify({
    userId: user.id,
    name: user.name,
    rationCard: user.rationCard,
    bookingId: userBooking?.id || null,
    timestamp: new Date().toISOString()
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Welcome, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* QR Code Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4">
                <QrCode className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Your QR Code</h2>
              </div>
              <div className="flex justify-center py-4">
                <QRCodeGenerator value={qrData} size={200} />
              </div>
              <div className="mt-4 text-center">
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => window.print()}
                >
                  Print QR Code
                </button>
              </div>
            </div>
          </div>

          {/* User Info Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4">
                <User className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Your Information</h2>
              </div>
              <div className="mt-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.contactNumber}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Ration Card</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.rationCard || 'Not assigned'}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.address}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Booking Info / Available Rations Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            {userBooking ? (
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Your Booking</h2>
                </div>
                <div className="mt-4">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(userBooking.date)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Time</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatTime(userBooking.startTime)} - {formatTime(userBooking.endTime)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {userBooking.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-6">
                    <Link
                      to="/slots"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Manage Booking
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <ShoppingBasket className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Available Rations</h2>
                </div>
                <div className="mt-4">
                  <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {stocks.map((stock) => (
                        <li key={stock.id} className="py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{stock.name}</p>
                              <p className="text-sm text-gray-500">
                                Price: ₹{stock.price} per {stock.unit}
                              </p>
                            </div>
                            <div className="text-sm text-gray-500">
                              {stock.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6">
                    <Link
                      to="/slots"
                      className=" inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Book a Collection Slot
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;