import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, Users, UserCog, QrCode, Accessibility, Globe, Volume2, VolumeX } from 'lucide-react';

const Home: React.FC = () => {
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const languages = {
    en: 'English',
    hi: 'हिंदी',
    ta: 'தமிழ்',
    te: 'తెలుగు',
    bn: 'বাংলা'
  };

  const fontSizes = {
    small: 'text-sm',
    normal: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };
  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black text-white' : 'bg-gray-50'} ${fontSizes[fontSize as keyof typeof fontSizes]}`}>
      {/* Accessibility Bar */}
      <div className="bg-blue-900 text-white py-2">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <Accessibility className="h-4 w-4" />
            <span>Accessibility Options:</span>
            <button
              onClick={() => setFontSize(fontSize === 'xlarge' ? 'normal' : fontSize === 'normal' ? 'large' : 'xlarge')}
              className="hover:text-blue-200 underline"
              aria-label="Increase font size"
            >
              Font: {fontSize}
            </button>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className="hover:text-blue-200 underline"
              aria-label="Toggle high contrast"
            >
              {highContrast ? 'Normal' : 'High'} Contrast
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="hover:text-blue-200 flex items-center"
              aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-blue-800 text-white text-sm rounded px-2 py-1"
              aria-label="Select language"
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className={`${highContrast ? 'bg-gray-900' : 'bg-green-600'} text-white py-16`}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-4" role="banner">
            {language === 'hi' ? 'ई-राशन सिस्टम में आपका स्वागत है' : 'Welcome to E-Ration System'}
          </h1>
          <p className="text-lg md:text-xl mb-8">
            {language === 'hi' ? 'QR कोड तकनीक के साथ राशन वितरण का डिजिटलीकरण' : 'Digitizing ration distribution with QR code technology'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/login"
              className={`${highContrast ? 'bg-white text-black border-2 border-white' : 'bg-white text-green-600'} px-6 py-3 rounded-md font-medium hover:opacity-90 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2`}
              aria-label="Login as user"
            >
              {language === 'hi' ? 'उपयोगकर्ता लॉगिन' : 'User Login'}
            </Link>
            <Link
              to="/admin/login"
              className={`${highContrast ? 'bg-gray-700 text-white border-2 border-gray-700' : 'bg-green-700 text-white'} px-6 py-3 rounded-md font-medium hover:opacity-90 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2`}
              aria-label="Login as administrator"
            >
              {language === 'hi' ? 'प्रशासक लॉगिन' : 'Admin Login'}
            </Link>
          </div>

          {/* Skip to content link for screen readers */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Skip to main content
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 container mx-auto px-4" id="main-content">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" role="heading" aria-level="2">
          {language === 'hi' ? 'हमारी विशेषताएं' : 'Our Features'}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className={`${highContrast ? 'bg-gray-800 border-2 border-white' : 'bg-white'} p-6 rounded-lg shadow-md text-center transform transition-transform hover:scale-105 focus-within:scale-105`} role="article" tabIndex="0">
            <div className="flex justify-center mb-4">
              <QrCode size={48} className={highContrast ? 'text-yellow-400' : 'text-green-600'} aria-hidden="true" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2" role="heading" aria-level="3">
              {language === 'hi' ? 'QR कोड जेनरेशन' : 'QR Code Generation'}
            </h3>
            <p className={highContrast ? 'text-gray-300' : 'text-gray-600'}>
              {language === 'hi'
                ? 'वितरण केंद्रों में आसान राशन संग्रह के लिए अनूठे QR कोड उत्पन्न करें'
                : 'Generate unique QR codes for easy ration collection at distribution centers'
              }
            </p>
          </div>

          <div className={`${highContrast ? 'bg-gray-800 border-2 border-white' : 'bg-white'} p-6 rounded-lg shadow-md text-center transform transition-transform hover:scale-105 focus-within:scale-105`} role="article" tabIndex="0">
            <div className="flex justify-center mb-4">
              <Users size={48} className={highContrast ? 'text-yellow-400' : 'text-green-600'} aria-hidden="true" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2" role="heading" aria-level="3">
              {language === 'hi' ? 'उपयोगकर्ता प्रबंधन' : 'User Management'}
            </h3>
            <p className={highContrast ? 'text-gray-300' : 'text-gray-600'}>
              {language === 'hi'
                ? 'पात्र नागरिकों के लिए आसान पंजीकरण और दस्तावेज़ सत्यापन'
                : 'Easy registration and document verification for eligible citizens'
              }
            </p>
          </div>

          <div className={`${highContrast ? 'bg-gray-800 border-2 border-white' : 'bg-white'} p-6 rounded-lg shadow-md text-center transform transition-transform hover:scale-105 focus-within:scale-105`} role="article" tabIndex="0">
            <div className="flex justify-center mb-4">
              <ShoppingBasket size={48} className={highContrast ? 'text-yellow-400' : 'text-green-600'} aria-hidden="true" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2" role="heading" aria-level="3">
              {language === 'hi' ? 'स्टॉक प्रबंधन' : 'Stock Management'}
            </h3>
            <p className={highContrast ? 'text-gray-300' : 'text-gray-600'}>
              {language === 'hi'
                ? 'प्रशासकों के लिए कुशल ��न्वेंटरी ट्रैकिंग और मूल्य प्रबंधन'
                : 'Efficient inventory tracking and price management for administrators'
              }
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className={`${highContrast ? 'bg-gray-900' : 'bg-gray-100'} py-16`}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" role="heading" aria-level="2">
            {language === 'hi' ? 'यह कैसे काम करता है' : 'How It Works'}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`${highContrast ? 'bg-gray-800 border-2 border-white' : 'bg-white'} p-6 rounded-lg shadow-md transform transition-transform hover:scale-105`} role="article">
              <div className={`${highContrast ? 'bg-yellow-600' : 'bg-green-600'} text-white rounded-full w-8 h-8 flex items-center justify-center mb-4 font-bold`} aria-label="Step 1">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2" role="heading" aria-level="3">
                {language === 'hi' ? 'पंजीकरण' : 'Register'}
              </h3>
              <p className={highContrast ? 'text-gray-300' : 'text-gray-600'}>
                {language === 'hi'
                  ? 'खाता बनाएं और आवश्यक दस्तावेज़ अपलोड कर���ं'
                  : 'Create an account and upload required documents'
                }
              </p>
            </div>

            <div className={`${highContrast ? 'bg-gray-800 border-2 border-white' : 'bg-white'} p-6 rounded-lg shadow-md transform transition-transform hover:scale-105`} role="article">
              <div className={`${highContrast ? 'bg-yellow-600' : 'bg-green-600'} text-white rounded-full w-8 h-8 flex items-center justify-center mb-4 font-bold`} aria-label="Step 2">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2" role="heading" aria-level="3">
                {language === 'hi' ? 'सत्यापन' : 'Verification'}
              </h3>
              <p className={highContrast ? 'text-gray-300' : 'text-gray-600'}>
                {language === 'hi'
                  ? 'प्रशासक आपके दस्तावेज़ों को सत्यापित करता है और आपके खाते को अनुमोदित करता है'
                  : 'Admin verifies your documents and approves your account'
                }
              </p>
            </div>

            <div className={`${highContrast ? 'bg-gray-800 border-2 border-white' : 'bg-white'} p-6 rounded-lg shadow-md transform transition-transform hover:scale-105`} role="article">
              <div className={`${highContrast ? 'bg-yellow-600' : 'bg-green-600'} text-white rounded-full w-8 h-8 flex items-center justify-center mb-4 font-bold`} aria-label="Step 3">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2" role="heading" aria-level="3">
                {language === 'hi' ? 'QR कोड प्राप्त करें' : 'Get QR Code'}
              </h3>
              <p className={highContrast ? 'text-gray-300' : 'text-gray-600'}>
                {language === 'hi'
                  ? 'अपने डैशबोर्ड से अपना अनूठा QR कोड उत्पन्न करें'
                  : 'Generate your unique QR code from your dashboard'
                }
              </p>
            </div>

            <div className={`${highContrast ? 'bg-gray-800 border-2 border-white' : 'bg-white'} p-6 rounded-lg shadow-md transform transition-transform hover:scale-105`} role="article">
              <div className={`${highContrast ? 'bg-yellow-600' : 'bg-green-600'} text-white rounded-full w-8 h-8 flex items-center justify-center mb-4 font-bold`} aria-label="Step 4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2" role="heading" aria-level="3">
                {language === 'hi' ? 'राशन एकत्र करें' : 'Collect Ration'}
              </h3>
              <p className={highContrast ? 'text-gray-300' : 'text-gray-600'}>
                {language === 'hi'
                  ? 'अपनी स्थानीय राशन की दुकान में जाएं और अपना QR कोड स्कैन करें'
                  : 'Visit your local ration shop and scan your QR code'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`${highContrast ? 'bg-black border-t-2 border-white' : 'bg-green-800'} text-white py-8`} role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-semibold mb-4">
                {language === 'hi' ? 'संपर्क जानकारी' : 'Contact Information'}
              </h3>
              <p className="text-sm">
                {language === 'hi' ? 'हेल्पलाइन: 1800-xxx-xxxx' : 'Helpline: 1800-xxx-xxxx'}
              </p>
              <p className="text-sm">Email: support@e-ration.gov.in</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">
                {language === 'hi' ? 'उपयोगी लिंक' : 'Useful Links'}
              </h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:underline">{language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}</a></li>
                <li><a href="#" className="hover:underline">{language === 'hi' ? 'नियम और शर्तें' : 'Terms of Service'}</a></li>
                <li><a href="#" className="hover:underline">{language === 'hi' ? 'सहायता' : 'Help & Support'}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">
                {language === 'hi' ? 'पहुंच' : 'Accessibility'}
              </h3>
              <p className="text-sm">
                {language === 'hi'
                  ? 'यह वेबसाइट WCAG 2.1 दिशानिर्देशों का पालन करती है'
                  : 'This website follows WCAG 2.1 guidelines'
                }
              </p>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-8 text-center">
            <p className="text-sm">
              {language === 'hi'
                ? '© 2025 ई-राशन सिस्टम। सभी अधिकार सुरक्षित।'
                : '© 2025 E-Ration System. All rights reserved.'
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
