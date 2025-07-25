import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Maximize2, Download, Printer, X, Share2, Copy, Check } from 'lucide-react';

interface QRDisplayProps {
  value: string;
  size?: number;
  userName?: string;
  bookingId?: string;
  rationCard?: string;
  validUntil?: string;
}

const QRDisplay: React.FC<QRDisplayProps> = ({ 
  value, 
  size = 200, 
  userName, 
  bookingId, 
  rationCard,
  validUntil 
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleFullScreen = () => {
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>E-Ration QR Code</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                margin: 0;
              }
              .qr-container { 
                display: inline-block; 
                border: 2px solid #000; 
                padding: 20px; 
                margin: 20px 0;
                background: white;
              }
              .header { 
                font-size: 24px; 
                font-weight: bold; 
                margin-bottom: 10px; 
                color: #059669;
              }
              .info { 
                margin: 10px 0; 
                font-size: 14px; 
              }
              .qr-code {
                margin: 20px 0;
              }
              .footer {
                font-size: 12px;
                color: #666;
                margin-top: 20px;
              }
              @media print {
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="header">E-Ration System</div>
              <div class="info"><strong>Name:</strong> ${userName || 'N/A'}</div>
              ${bookingId ? `<div class="info"><strong>Booking ID:</strong> ${bookingId}</div>` : ''}
              ${rationCard ? `<div class="info"><strong>Ration Card:</strong> ${rationCard}</div>` : ''}
              <div class="qr-code">${qrRef.current?.innerHTML || ''}</div>
              ${validUntil ? `<div class="info"><strong>Valid Until:</strong> ${validUntil}</div>` : ''}
              <div class="footer">
                Present this QR code at the ration distribution center<br/>
                along with a valid photo ID
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const svg = qrRef.current?.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `ration-qr-${bookingId || 'code'}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'E-Ration QR Code',
          text: 'My E-Ration QR Code for collection',
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing: ', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <>
      {/* Regular QR Display */}
      <div className="flex flex-col items-center space-y-4">
        <div ref={qrRef} className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
          <QRCodeSVG 
            value={value} 
            size={size} 
            bgColor="#ffffff"
            fgColor="#000000"
            level="M"
            includeMargin={true}
          />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Scan this QR code at your ration distribution center
          </p>
          
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={handleFullScreen}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Full Screen
            </button>
            
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
            
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
            
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Data
                </>
              )}
            </button>
            
            <button
              onClick={handleShare}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* QR Code Information */}
        {(userName || bookingId || rationCard) && (
          <div className="bg-gray-50 p-4 rounded-lg w-full max-w-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">QR Code Information</h4>
            <div className="space-y-1 text-sm text-gray-600">
              {userName && <p><strong>Name:</strong> {userName}</p>}
              {bookingId && <p><strong>Booking ID:</strong> {bookingId}</p>}
              {rationCard && <p><strong>Ration Card:</strong> {rationCard}</p>}
              {validUntil && <p><strong>Valid Until:</strong> {validUntil}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg p-8 max-w-2xl w-full">
            <button
              onClick={closeFullScreen}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">E-Ration QR Code</h2>
              <p className="text-gray-600 mb-8">Present this QR code at the ration distribution center</p>
              
              <div className="flex justify-center mb-8">
                <div className="bg-white p-8 rounded-lg shadow-2xl border-4 border-gray-300">
                  <QRCodeSVG 
                    value={value} 
                    size={300} 
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                    includeMargin={true}
                  />
                </div>
              </div>
              
              {/* Information Card */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {userName && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-lg text-gray-900">{userName}</p>
                    </div>
                  )}
                  {bookingId && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Booking ID</label>
                      <p className="text-lg font-mono text-gray-900">{bookingId}</p>
                    </div>
                  )}
                  {rationCard && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ration Card</label>
                      <p className="text-lg text-gray-900">{rationCard}</p>
                    </div>
                  )}
                  {validUntil && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Valid Until</label>
                      <p className="text-lg text-gray-900">{validUntil}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Printer className="h-5 w-5 mr-2" />
                  Print QR Code
                </button>
                
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QRDisplay;
