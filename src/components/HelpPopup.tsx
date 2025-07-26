import React, { useState } from 'react';
import { HelpCircle, X, Phone, Mail, MessageCircle, Book, Video, ChevronRight } from 'lucide-react';

interface HelpItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'booking' | 'qr' | 'account' | 'technical';
}

interface HelpPopupProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string; // Context-specific help
}

const helpItems: HelpItem[] = [
  {
    id: '1',
    question: 'How do I register for the E-Ration system?',
    answer: 'Click on "Register" from the homepage, fill in your personal details, upload required documents (ID proof, address proof), and verify your phone number with OTP.',
    category: 'account'
  },
  {
    id: '2',
    question: 'How do I book a collection slot?',
    answer: 'After logging in, go to "Book Slot" section, select a date, choose an available time slot, and confirm your booking. You\'ll receive a confirmation with booking details.',
    category: 'booking'
  },
  {
    id: '3',
    question: 'How do I use my QR code?',
    answer: 'Generate your QR code from the dashboard, save or print it, and present it at the ration distribution center along with a valid photo ID.',
    category: 'qr'
  },
  {
    id: '4',
    question: 'What if I forgot my password?',
    answer: 'Use the "Phone Login" option on the login page to receive an OTP on your registered mobile number, or contact support for password reset.',
    category: 'account'
  },
  {
    id: '5',
    question: 'Can I cancel or modify my booking?',
    answer: 'Yes, you can cancel your booking from the dashboard or slot management page. To modify, cancel the current booking and create a new one.',
    category: 'booking'
  },
  {
    id: '6',
    question: 'Why is my QR code not working?',
    answer: 'Ensure your QR code is not expired, you have an active booking, and your account is verified. Contact support if issues persist.',
    category: 'qr'
  },
  {
    id: '7',
    question: 'What documents do I need to upload?',
    answer: 'You need to upload valid ID proof (Aadhaar, PAN, etc.), address proof, and income certificate. Files should be in JPG, PNG, or PDF format under 10MB.',
    category: 'account'
  },
  {
    id: '8',
    question: 'How do I check available ration items?',
    answer: 'Available items and their prices are shown on your dashboard. Stock levels are updated in real-time.',
    category: 'general'
  }
];

const HelpPopup: React.FC<HelpPopupProps> = ({ isOpen, onClose, context }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', name: 'All Topics', icon: Book },
    { id: 'account', name: 'Account', icon: HelpCircle },
    { id: 'booking', name: 'Booking', icon: HelpCircle },
    { id: 'qr', name: 'QR Code', icon: HelpCircle },
    { id: 'general', name: 'General', icon: HelpCircle },
    { id: 'technical', name: 'Technical', icon: HelpCircle }
  ];

  const filteredItems = helpItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const contextSpecificHelp = {
    login: [
      'How do I register for the E-Ration system?',
      'What if I forgot my password?'
    ],
    booking: [
      'How do I book a collection slot?',
      'Can I cancel or modify my booking?'
    ],
    qr: [
      'How do I use my QR code?',
      'Why is my QR code not working?'
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <HelpCircle className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Help & Support</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-200 p-4 max-h-[70vh] overflow-y-auto">
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Categories */}
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {category.id === 'all' 
                      ? helpItems.length 
                      : helpItems.filter(item => item.category === category.id).length
                    }
                  </span>
                </button>
              ))}
            </div>

            {/* Contact Support */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Need More Help?</h3>
              <div className="space-y-2">
                <a
                  href="tel:1800-xxx-xxxx"
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support: 1800-xxx-xxxx
                </a>
                <a
                  href="mailto:support@e-ration.gov.in"
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email: support@e-ration.gov.in
                </a>
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat (9 AM - 6 PM)
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 max-h-[70vh] overflow-y-auto">
            {context && contextSpecificHelp[context as keyof typeof contextSpecificHelp] && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Related to your current task:
                </h3>
                <div className="space-y-1">
                  {contextSpecificHelp[context as keyof typeof contextSpecificHelp].map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const item = helpItems.find(item => item.question === question);
                        if (item) setExpandedItem(item.id);
                      }}
                      className="block text-sm text-blue-700 hover:text-blue-900 underline text-left"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or browse by category.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                    >
                      <span className="text-sm font-medium text-gray-900">{item.question}</span>
                      <ChevronRight 
                        className={`h-4 w-4 text-gray-400 transform transition-transform ${
                          expandedItem === item.id ? 'rotate-90' : ''
                        }`} 
                      />
                    </button>
                    {expandedItem === item.id && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mt-2">{item.answer}</p>
                        <div className="mt-3 flex items-center text-xs text-gray-500">
                          <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Video Tutorials */}
            <div className="mt-8 bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Video className="h-4 w-4 mr-2" />
                Video Tutorials
              </h3>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  How to register and verify your account
                </a>
                <a
                  href="#"
                  className="block text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Booking slots and using QR codes
                </a>
                <a
                  href="#"
                  className="block text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Collecting ration from distribution centers
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Was this helpful? 
              <button className="ml-2 text-blue-600 hover:text-blue-800 underline">
                Give feedback
              </button>
            </p>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPopup;
