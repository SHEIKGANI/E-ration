import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStock } from '../context/StockContext';
import { useSlot } from '../context/SlotContext';
import { 
  BarChart, 
  Users, 
  ShoppingBasket, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  Download,
  FileText,
  Scan,
  Settings,
  Bell,
  Eye,
  UserCheck,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { admin } = useAuth();
  const { stocks } = useStock();
  const { timeSlots, bookings } = useSlot();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Please login as admin to access this page</p>
      </div>
    );
  }

  // Enhanced statistics calculation
  const totalUsers = 156;
  const pendingApprovals = 12;
  const totalTransactions = 423;
  const stocksLow = stocks.filter(stock => stock.quantity < 20).length;
  const stocksOut = stocks.filter(stock => stock.quantity === 0).length;
  
  // Slot statistics
  const todayDate = new Date().toISOString().split('T')[0];
  const todaySlots = timeSlots.filter(slot => slot.date === todayDate);
  const todayBookings = bookings.filter(booking => booking.date === todayDate && booking.status === 'confirmed');
  const totalBookings = bookings.filter(booking => booking.status === 'confirmed').length;
  const capacityUtilization = todaySlots.length > 0 
    ? Math.round((todayBookings.length / todaySlots.reduce((sum, slot) => sum + slot.maxCapacity, 0)) * 100)
    : 0;

  // Alert items
  const alerts = [
    ...(stocksOut > 0 ? [{ type: 'critical', message: `${stocksOut} items out of stock`, action: 'Restock immediately' }] : []),
    ...(stocksLow > 0 ? [{ type: 'warning', message: `${stocksLow} items running low`, action: 'Plan restocking' }] : []),
    ...(pendingApprovals > 0 ? [{ type: 'info', message: `${pendingApprovals} user approvals pending`, action: 'Review applications' }] : []),
  ];

  const handleExportReport = (type: string) => {
    // Simulate report generation
    const reportData = {
      stocks: stocks,
      bookings: bookings,
      slots: timeSlots,
      users: totalUsers,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `e-ration-${type}-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600">E-Ration System Management</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{alerts.length} alerts</span>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="rounded-md border-gray-300 text-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              System Alerts
            </h2>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm opacity-75">{alert.action}</p>
                    </div>
                    <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm font-medium hover:bg-opacity-30">
                      Action
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/admin/scan"
              className="flex flex-col items-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Scan className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Scan QR Code</span>
            </Link>
            <Link
              to="/admin/stocks"
              className="flex flex-col items-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingBasket className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Manage Stocks</span>
            </Link>
            <Link
              to="/admin/slots"
              className="flex flex-col items-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Calendar className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Manage Slots</span>
            </Link>
            <button
              onClick={() => handleExportReport('daily')}
              className="flex flex-col items-center p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Download className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Export Report</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-2xl font-bold text-gray-900">{totalUsers}</dd>
                    <dd className="text-sm text-green-600">+12 this week</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="font-medium text-blue-600">{pendingApprovals} pending approvals</span>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingBasket className={`h-6 w-6 ${stocksLow > 0 ? 'text-red-400' : 'text-green-400'}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Stock Status</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stocks.length - stocksOut}</dd>
                    <dd className={`text-sm ${stocksLow > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {stocksLow} items low
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/admin/stocks" className="font-medium text-green-600 hover:text-green-500">
                  Manage stocks
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Today's Bookings</dt>
                    <dd className="text-2xl font-bold text-gray-900">{todayBookings.length}</dd>
                    <dd className="text-sm text-gray-600">{capacityUtilization}% capacity</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/admin/slots" className="font-medium text-green-600 hover:text-green-500">
                  Manage slots
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Distributions</dt>
                    <dd className="text-2xl font-bold text-gray-900">{totalTransactions}</dd>
                    <dd className="text-sm text-green-600">+18% this month</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <button 
                  onClick={() => handleExportReport('transactions')}
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Export report
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Schedule */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Today's Schedule</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{todaySlots.length} slots</span>
                </div>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {todaySlots.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {todaySlots.map((slot) => {
                    const slotBookings = todayBookings.filter(b => b.slotId === slot.id);
                    const utilizationPercentage = Math.round((slot.currentBookings / slot.maxCapacity) * 100);
                    
                    return (
                      <li key={slot.id} className="px-4 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {slot.startTime} - {slot.endTime}
                            </p>
                            <p className="text-sm text-gray-500">
                              {slot.currentBookings} of {slot.maxCapacity} slots booked
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  utilizationPercentage >= 90 ? 'bg-red-500' :
                                  utilizationPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${utilizationPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{utilizationPercentage}%</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No slots scheduled</h3>
                  <p className="mt-1 text-sm text-gray-500">Create slots for today to see them here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                <li className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">New slot booking</p>
                        <p className="text-sm text-gray-500">Priya Patel booked slot for tomorrow</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">5 min ago</span>
                  </div>
                </li>
                <li className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">User registered</p>
                        <p className="text-sm text-gray-500">Rahul Sharma completed registration</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">10 min ago</span>
                  </div>
                </li>
                <li className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Stock updated</p>
                        <p className="text-sm text-gray-500">Rice quantity updated to 100kg</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">1 hour ago</span>
                  </div>
                </li>
                <li className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">QR code scanned</p>
                        <p className="text-sm text-gray-500">Successful verification for RC45678</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                  </div>
                </li>
                <li className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Low stock alert</p>
                        <p className="text-sm text-gray-500">Wheat stock below threshold</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">3 hours ago</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Export Reports</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleExportReport('stocks')}
                className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Stock Report</span>
              </button>
              <button
                onClick={() => handleExportReport('bookings')}
                className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Booking Report</span>
              </button>
              <button
                onClick={() => handleExportReport('users')}
                className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">User Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
