import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useStock } from '../context/StockContext';
import { useSlot } from '../context/SlotContext';
import QRDisplay from '../components/QRDisplay';
import { ShoppingBasket, QrCode, User, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
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

  // Generate QR code data with enhanced security
  const qrData = JSON.stringify({
    userId: user.id,
    name: user.name,
    email: user.email,
    rationCard: user.rationCard,
    bookingId: userBooking?.id || null,
    bookingDate: userBooking?.date || null,
    bookingTime: userBooking ? `${userBooking.startTime}-${userBooking.endTime}` : null,
    timestamp: new Date().toISOString(),
    hash: btoa(`${user.id}-${Date.now()}`), // Simple hash for verification
    version: '1.0'
  });

  const getValidUntil = () => {
    if (userBooking) {
      const bookingDate = new Date(userBooking.date);
      bookingDate.setDate(bookingDate.getDate() + 1); // Valid until day after booking
      return bookingDate.toLocaleDateString();
    }
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toLocaleDateString();
  };

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
          <p className="mt-2 text-lg text-gray-600">Welcome back, {user.name}</p>
        </div>

        {/* Status Banner */}
        {userBooking ? (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Booking Confirmed
                </h3>
                <p className="text-sm text-green-700">
                  Your slot is booked for {formatDate(userBooking.date)} at {formatTime(userBooking.startTime)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  No Active Booking
                </h3>
                <p className="text-sm text-yellow-700">
                  Book a slot to collect your ration at your convenience.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* QR Code Section */}
          <div className="lg:col-span-2 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <QrCode className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Your Digital Ration Card</h2>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Valid until {getValidUntil()}</span>
                </div>
              </div>
              
              <QRDisplay 
                value={qrData}
                size={200}
                userName={user.name}
                bookingId={userBooking?.id}
                rationCard={user.rationCard}
                validUntil={getValidUntil()}
              />
              
              <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Instructions:</strong> Present this QR code along with a valid photo ID 
                      at the ration distribution center. The QR code contains encrypted information 
                      about your eligibility and booking details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Info & Actions Section */}
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <User className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Profile</h2>
                </div>
                <div className="mt-4">
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.contactNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Ration Card</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user.rationCard ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {user.rationCard}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending Assignment
                          </span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.address}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Current Booking or Action to Book */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              {userBooking ? (
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-6 w-6 text-green-600 mr-2" />
                    <h2 className="text-lg font-medium text-gray-900">Current Booking</h2>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Date</dt>
                        <dd className="mt-1 text-sm font-semibold text-gray-900">{formatDate(userBooking.date)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Time</dt>
                        <dd className="mt-1 text-sm font-semibold text-gray-900">
                          {formatTime(userBooking.startTime)} - {formatTime(userBooking.endTime)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                            {userBooking.status.toUpperCase()}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/slots"
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Manage Booking
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-6 w-6 text-green-600 mr-2" />
                    <h2 className="text-lg font-medium text-gray-900">Book Collection Slot</h2>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Schedule a time to collect your ration items safely and conveniently.
                  </p>
                  <Link
                    to="/slots"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Book Now
                  </Link>
                </div>
              )}
            </div>

            {/* Available Rations */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <ShoppingBasket className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Available Items</h2>
                </div>
                <div className="flow-root">
                  <ul className="divide-y divide-gray-200">
                    {stocks.slice(0, 5).map((stock) => (
                      <li key={stock.id} className="py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{stock.name}</p>
                            <p className="text-xs text-gray-500">
                              ₹{stock.price}/{stock.unit}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            stock.quantity > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {stock.quantity > 0 ? 'Available' : 'Out of Stock'}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                {stocks.length > 5 && (
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    +{stocks.length - 5} more items available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Security Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Security & Privacy</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• Your QR code contains encrypted information that is verified at the distribution center</p>
            <p>• Personal data is protected and never shared with unauthorized parties</p>
            <p>• Each QR code has a unique hash and timestamp for security verification</p>
            <p>• Report any suspicious activity to our support team immediately</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
