import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, AlertCircle, CheckCircle, Scan, RefreshCw, HelpCircle } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

interface ScannedData {
  userId?: string;
  name?: string;
  email?: string;
  rationCard?: string;
  bookingId?: string;
  bookingDate?: string;
  bookingTime?: string;
  timestamp?: string;
  hash?: string;
  version?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose, isOpen }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScannedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen && isScanning) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, isScanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setError(null);
    } catch (err) {
      setError('Unable to access camera. Please ensure camera permissions are granted.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleStartScanning = () => {
    setIsScanning(true);
    setScanResult(null);
    setError(null);
  };

  const handleStopScanning = () => {
    setIsScanning(false);
    stopCamera();
  };

  // Simulate QR code scanning (in real app, use a QR code scanning library)
  const simulateScan = (testData?: string) => {
    const mockQRData = testData || JSON.stringify({
      userId: '12345',
      name: 'John Doe',
      email: 'john@example.com',
      rationCard: 'RC001234',
      bookingId: 'BK789',
      bookingDate: '2025-01-20',
      bookingTime: '10:00-11:00',
      timestamp: new Date().toISOString(),
      hash: btoa('12345-' + Date.now()),
      version: '1.0'
    });

    try {
      const parsed = JSON.parse(mockQRData);
      setScanResult(parsed);
      setIsScanning(false);
      stopCamera();
      onScan(mockQRData);
    } catch (err) {
      setError('Invalid QR code format');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      simulateScan(manualInput);
      setManualInput('');
      setShowManualInput(false);
    }
  };

  const verifyData = (data: ScannedData) => {
    const issues = [];
    
    if (!data.userId || !data.name) {
      issues.push('Missing user identification');
    }
    
    if (data.bookingId && !data.bookingDate) {
      issues.push('Booking ID present but no booking date');
    }
    
    if (data.timestamp) {
      const scanTime = new Date();
      const qrTime = new Date(data.timestamp);
      const timeDiff = scanTime.getTime() - qrTime.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        issues.push('QR code is older than 24 hours');
      }
    }
    
    return issues;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Scan className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">QR Code Scanner</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Help Section */}
        {showHelp && (
          <div className="p-4 bg-blue-50 border-b border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">How to scan QR codes:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Click "Start Scanning" and allow camera access</li>
              <li>Point camera at the QR code</li>
              <li>Keep the QR code centered in the frame</li>
              <li>Ensure good lighting for better scanning</li>
              <li>Use manual input if camera scanning fails</li>
            </ul>
          </div>
        )}

        {/* Main Content */}
        <div className="p-6">
          {!isScanning && !scanResult ? (
            // Initial State
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Camera className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Scan</h3>
              <p className="text-gray-600 mb-6">
                Position the customer's QR code in front of your camera to verify their ration eligibility
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleStartScanning}
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Start Scanning
                </button>
                
                <button
                  onClick={() => setShowManualInput(true)}
                  className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Manual Input
                </button>
                
                {/* Demo button for testing */}
                <button
                  onClick={() => simulateScan()}
                  className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-gray-50 hover:bg-gray-100"
                >
                  Demo Scan (Test)
                </button>
              </div>
            </div>
          ) : isScanning ? (
            // Scanning State
            <div>
              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-green-400 w-48 h-48 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-green-400"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-green-400"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-green-400"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-green-400"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
                  Center QR code in frame
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleStopScanning}
                  className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Stop Scanning
                </button>
                
                <button
                  onClick={() => simulateScan()}
                  className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <Scan className="h-4 w-4 mr-2" />
                  Simulate Scan
                </button>
              </div>
            </div>
          ) : scanResult ? (
            // Result State
            <div>
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">QR Code Scanned Successfully</h3>
              </div>
              
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Customer Information</h4>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Name</dt>
                    <dd className="text-sm text-gray-900">{scanResult.name || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">User ID</dt>
                    <dd className="text-sm font-mono text-gray-900">{scanResult.userId || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Ration Card</dt>
                    <dd className="text-sm text-gray-900">{scanResult.rationCard || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{scanResult.email || 'N/A'}</dd>
                  </div>
                  {scanResult.bookingId && (
                    <>
                      <div>
                        <dt className="text-xs font-medium text-gray-500">Booking ID</dt>
                        <dd className="text-sm font-mono text-gray-900">{scanResult.bookingId}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-500">Booking Time</dt>
                        <dd className="text-sm text-gray-900">
                          {scanResult.bookingDate} {scanResult.bookingTime}
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>
              
              {/* Verification Status */}
              <div className="mb-4">
                {(() => {
                  const issues = verifyData(scanResult);
                  return issues.length === 0 ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">Verification Successful</h3>
                          <p className="text-sm text-green-700">Customer is eligible for ration collection</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">Verification Issues</h3>
                          <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
                            {issues.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setScanResult(null);
                    setError(null);
                  }}
                  className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Scan Another
                </button>
                
                <button
                  onClick={onClose}
                  className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </button>
              </div>
            </div>
          ) : null}
          
          {/* Manual Input Modal */}
          {showManualInput && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Manual QR Code Input</h3>
                <form onSubmit={handleManualSubmit}>
                  <textarea
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Paste QR code data here..."
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowManualInput(false)}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Process
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
