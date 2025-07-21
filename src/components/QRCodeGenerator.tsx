import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ value, size = 128 }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <QRCodeSVG value={value} size={size} />
      </div>
      <p className="mt-2 text-sm text-gray-600">Scan this QR code at your ration shop</p>
    </div>
  );
};

export default QRCodeGenerator;