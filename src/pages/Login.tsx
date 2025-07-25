import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, Smartphone, AlertCircle, CheckCircle } from 'lucide-react';
import OTPVerification from '../components/OTPVerification';

interface LoginFormData {
  email: string;
  password: string;
}

interface PhoneLoginData {
  phoneNumber: string;
}

type LoginMethod = 'email' | 'phone' | 'otp';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { register: registerPhone, handleSubmit: handlePhoneSubmit, formState: { errors: phoneErrors } } = useForm<PhoneLoginData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const matchedUser = users.find(
        (user: any) =>
          user.email === data.email && user.password === data.password
      );

      if (matchedUser) {
        localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError('Invalid email or password. Please try again or use phone login.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onPhoneSubmit = async (data: PhoneLoginData) => {
    setIsLoading(true);
    setError(null);

    try {
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const matchedUser = users.find((user: any) => user.contactNumber === data.phoneNumber);

      if (matchedUser) {
        setPhoneNumber(data.phoneNumber);
        setLoginMethod('otp');
        setSuccess('OTP sent to your phone number!');
      } else {
        setError('Phone number not registered. Please register first.');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string): Promise<boolean> => {
    // Simulate OTP verification - in real app, verify with backend
    if (otp === '123456') {
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const matchedUser = users.find((user: any) => user.contactNumber === phoneNumber);

      if (matchedUser) {
        localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
        return true;
      }
    }
    return false;
  };

  const handleResendOTP = async (): Promise<void> => {
    // Simulate resending OTP
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleBackToLogin = () => {
    setLoginMethod('email');
    setPhoneNumber('');
    setError(null);
    setSuccess(null);
  };

  if (loginMethod === 'otp') {
    return (
      <OTPVerification
        phoneNumber={phoneNumber}
        onVerify={handleOTPVerify}
        onResend={handleResendOTP}
        onBack={handleBackToLogin}
        purpose="login"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          {loginMethod === 'email' ? (
            <LogIn className="h-12 w-12 text-green-600" />
          ) : (
            <Smartphone className="h-12 w-12 text-green-600" />
          )}
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {loginMethod === 'email' ? 'User Login' : 'Phone Login'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your E-Ration account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Login Method Toggle */}
          <div className="mb-6">
            <div className="flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                  loginMethod === 'email'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                  loginMethod === 'phone'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Phone
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          {loginMethod === 'email' ? (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
          ) : (
            <form className="space-y-6" onSubmit={handlePhoneSubmit(onPhoneSubmit)}>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Enter your 10-digit phone number"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    {...registerPhone('phoneNumber', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Please enter a valid 10-digit phone number'
                      }
                    })}
                  />
                  {phoneErrors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{phoneErrors.phoneNumber.message}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending OTP...
                    </div>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/register')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Register
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-xs text-blue-700">
                  <strong>Security:</strong> Your login credentials are encrypted and stored securely.
                  Use OTP for enhanced security if you prefer not to use passwords.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
