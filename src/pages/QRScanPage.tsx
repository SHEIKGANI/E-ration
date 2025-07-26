import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QRScanner from '../components/QRScanner';
import { Scan, ArrowLeft, Users, Clock, CheckCircle } from 'lucide-react';

interface ScanRecord {
  id: string;
  timestamp: string;
  customerName: string;
  userId: string;
  rationCard: string;
  bookingId?: string;
  status: 'verified' | 'issues' | 'rejected';
}

const QRScanPage: React.FC = () => {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [dailyStats, setDailyStats] = useState({
    totalScans: 0,
    successfulVerifications: 0,
    rejectedScans: 0
  });

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Admin access required</p>
      </div>
    );
  }

  const handleScan = (qrData: string) => {
    try {
      const data = JSON.parse(qrData);
      
      // Simulate verification logic
      const hasIssues = !data.userId || !data.name || !data.rationCard;
      const status = hasIssues ? 'issues' : 'verified';
      
      const newRecord: ScanRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        customerName: data.name || 'Unknown',
        userId: data.userId || 'N/A',
        rationCard: data.rationCard || 'N/A',
        bookingId: data.bookingId,
        status
      };
      
      setScanHistory(prev => [newRecord, ...prev]);
      setDailyStats(prev => ({
        totalScans: prev.totalScans + 1,
        successfulVerifications: status === 'verified' ? prev.successfulVerifications + 1 : prev.successfulVerifications,
        rejectedScans: status === 'issues' ? prev.rejectedScans + 1 : prev.rejectedScans
      }));
      
      setShowScanner(false);
    } catch (error) {
      console.error('Error processing scan:', error);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'issues':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">QR Code Scanner</h1>
                <p className="mt-2 text-lg text-gray-600">Verify customer eligibility for ration collection</p>
              </div>
            </div>
            <button
              onClick={() => setShowScanner(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Scan className="h-5 w-5 mr-2" />
              Start Scanning
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Scan className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Scans Today</dt>
                      <dd className="text-lg font-medium text-gray-900">{dailyStats.totalScans}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Successful Verifications</dt>
                      <dd className="text-lg font-medium text-gray-900">{dailyStats.successfulVerifications}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Issues Detected</dt>
                      <dd className="text-lg font-medium text-gray-900">{dailyStats.rejectedScans}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scanning Instructions */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Scanning Instructions
                </h3>
                <div className="text-sm text-gray-600 space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-semibold text-green-800">1</span>
                    </div>
                    <p>Ask customer to present their QR code</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-semibold text-green-800">2</span>
                    </div>
                    <p>Click "Start Scanning" and allow camera access</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-semibold text-green-800">3</span>
                    </div>
                    <p>Center the QR code in the camera frame</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-semibold text-green-800">4</span>
                    </div>
                    <p>Verify customer information and eligibility</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-semibold text-green-800">5</span>
                    </div>
                    <p>Proceed with ration distribution if verified</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Ensure good lighting and ask customer to keep phone steady for best scanning results.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scan History */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recent Scans
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
                
                {scanHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Scan className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No scans yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Start scanning QR codes to see the history here.</p>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {scanHistory.slice(0, 10).map((record) => (
                        <li key={record.id} className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {record.customerName}
                              </p>
                              <div className="flex items-center text-sm text-gray-500 space-x-4">
                                <span>ID: {record.userId}</span>
                                <span>Card: {record.rationCard}</span>
                                {record.bookingId && <span>Booking: {record.bookingId}</span>}
                              </div>
                              <p className="text-xs text-gray-400">
                                {formatDate(record.timestamp)} at {formatTime(record.timestamp)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(record.status)}`}>
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    {scanHistory.length > 10 && (
                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">
                          Showing 10 of {scanHistory.length} scans
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* QR Scanner Modal */}
        <QRScanner
          isOpen={showScanner}
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      </div>
    </div>
  );
};

export default QRScanPage;
