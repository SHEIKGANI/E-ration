import React, { useState } from 'react';
import { Shield, Lock, Eye, Database, AlertCircle, X, Check } from 'lucide-react';

interface PrivacyNoticeProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ isOpen, onClose, onAccept }) => {
  const [acceptedSections, setAcceptedSections] = useState<string[]>([]);

  if (!isOpen) return null;

  const privacySections = [
    {
      id: 'data-collection',
      title: 'Data Collection',
      icon: Database,
      content: 'We collect only essential information required for ration distribution: personal identification, contact details, address, and government-issued document numbers. No sensitive financial information is stored.',
      required: true
    },
    {
      id: 'data-usage',
      title: 'Data Usage',
      icon: Eye,
      content: 'Your information is used exclusively for ration distribution, eligibility verification, and system administration. We do not sell, share, or use your data for marketing purposes.',
      required: true
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: 'All personal data is encrypted using industry-standard AES-256 encryption. QR codes contain hashed, non-reversible identifiers. System access is logged and monitored.',
      required: true
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: Shield,
      content: 'Personal data is retained as per government regulations. You may request data deletion after eligibility period ends, subject to legal compliance requirements.',
      required: false
    }
  ];

  const handleSectionAccept = (sectionId: string) => {
    if (!acceptedSections.includes(sectionId)) {
      setAcceptedSections([...acceptedSections, sectionId]);
    }
  };

  const allRequiredAccepted = privacySections
    .filter(section => section.required)
    .every(section => acceptedSections.includes(section.id));

  const handleAcceptAll = () => {
    if (allRequiredAccepted) {
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600 mr-2" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Privacy & Security Notice</h2>
              <p className="text-sm text-gray-600">E-Ration System Data Protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Government Compliance</h3>
                <p className="text-sm text-green-700">
                  This system complies with Digital India initiatives and follows all applicable 
                  data protection regulations including the IT Act 2000 and Digital Personal Data Protection Act 2023.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {privacySections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <section.icon className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                      {section.required && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{section.content}</p>
                  </div>
                  <div className="ml-4">
                    {acceptedSections.includes(section.id) ? (
                      <div className="flex items-center text-green-600">
                        <Check className="h-5 w-5 mr-1" />
                        <span className="text-sm font-medium">Accepted</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSectionAccept(section.id)}
                        className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Security Features */}
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Security Features
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">End-to-end encryption</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Secure QR code generation</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Multi-factor authentication</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Audit trail logging</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Regular security updates</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Data minimization</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Questions about Privacy?</h3>
            <p className="text-sm text-blue-800">
              Contact our Data Protection Officer at{' '}
              <a href="mailto:privacy@e-ration.gov.in" className="underline">privacy@e-ration.gov.in</a>
              {' '}or call our helpline at 1800-xxx-xxxx
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>You must accept all required sections to continue</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptAll}
                disabled={!allRequiredAccepted}
                className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  allRequiredAccepted
                    ? 'text-white bg-green-600 hover:bg-green-700'
                    : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                }`}
              >
                Accept & Continue ({acceptedSections.length}/{privacySections.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;
