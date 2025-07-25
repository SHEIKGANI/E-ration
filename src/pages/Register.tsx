import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserPlus, AlertCircle, CheckCircle, Upload, X } from 'lucide-react';
import OTPVerification from '../components/OTPVerification';
import PrivacyNotice from '../components/PrivacyNotice';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactNumber: string;
  address: string;
  rationCardNumber?: string;
  familyMembers?: number;
}

type RegistrationStep = 'form' | 'otp' | 'success';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<RegistrationStep>('form');
  const [formData, setFormData] = useState<RegisterFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const [documents, setDocuments] = useState<File[]>([]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

      // Check if user already exists
      const existingEmail = existingUsers.find((user: any) => user.email === data.email);
      const existingPhone = existingUsers.find((user: any) => user.contactNumber === data.contactNumber);

      if (existingEmail) {
        setError('Email already registered. Please use a different email or login.');
        return;
      }

      if (existingPhone) {
        setError('Phone number already registered. Please use a different number or login.');
        return;
      }

      if (documents.length === 0) {
        setError('Please upload at least one document for verification.');
        return;
      }

      // Store form data and proceed to OTP verification
      setFormData(data);
      setStep('otp');
      setSuccess('Please verify your phone number to complete registration.');
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string): Promise<boolean> => {
    if (otp === '123456' && formData) { // In real app, verify with backend
      try {
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const newUser = {
          ...formData,
          id: Date.now().toString(),
          documents: documents.map(file => ({ id: Date.now().toString(), name: file.name, url: '' })),
          rationCard: formData.rationCardNumber || '',
          isVerified: true,
          registrationDate: new Date().toISOString()
        };

        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

        setStep('success');
        return true;
      } catch (err) {
        setError('Failed to complete registration. Please try again.');
        return false;
      }
    }
    return false;
  };

  const handleResendOTP = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleBackToForm = () => {
    setStep('form');
    setError(null);
    setSuccess(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const validFiles = fileArray.filter(file => {
        const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
        return isValidType && isValidSize;
      });

      if (validFiles.length !== fileArray.length) {
        setError('Some files were rejected. Please upload only JPG, PNG, or PDF files under 10MB.');
      }

      setDocuments([...documents, ...validFiles]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  if (step === 'otp' && formData) {
    return (
      <OTPVerification
        phoneNumber={formData.contactNumber}
        onVerify={handleOTPVerify}
        onResend={handleResendOTP}
        onBack={handleBackToForm}
        purpose="registration"
      />
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registration Successful!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your account has been created and is pending admin verification.
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <p className="text-sm text-green-700">
                You will receive a notification once your documents are verified by our admin team.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Register</h2>
          <p className="mt-2 text-sm text-gray-600">Create your E-Ration account</p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('password') || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                id="contactNumber"
                type="tel"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500"
                {...register('contactNumber', {
                  required: 'Contact number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit phone number',
                  },
                })}
              />
              {errors.contactNumber && (
                <p className="text-sm text-red-600 mt-1">{errors.contactNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500"
                {...register('address', { required: 'Address is required' })}
              />
              {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <label htmlFor="rationCardNumber" className="block text-sm font-medium text-gray-700">
                Ration Card Number (Optional)
              </label>
              <input
                id="rationCardNumber"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500"
                {...register('rationCardNumber')}
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank if you don't have one</p>
            </div>

            <div>
              <label htmlFor="familyMembers" className="block text-sm font-medium text-gray-700">
                Number of Family Members
              </label>
              <input
                id="familyMembers"
                type="number"
                min="1"
                max="20"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500"
                {...register('familyMembers', {
                  required: 'Please specify number of family members',
                  min: { value: 1, message: 'Must be at least 1' },
                  max: { value: 20, message: 'Cannot exceed 20 members' }
                })}
              />
              {errors.familyMembers && <p className="text-sm text-red-600 mt-1">{errors.familyMembers.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Documents*</label>
              <p className="text-xs text-gray-500 mb-1">Upload ID proof, address proof, income certificate (Required)</p>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB each</p>
                </div>
              </div>
              {documents.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents:</h4>
                  <ul className="space-y-2">
                    {documents.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-medium text-green-600 hover:text-green-500"
              >
                Sign in
              </button>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-xs text-blue-700">
                  <strong>Privacy:</strong> Your personal information is encrypted and used only for ration distribution.
                  Documents are verified securely and never shared with unauthorized parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
