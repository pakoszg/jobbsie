import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useLogin, useRegister } from '../hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';
import type { LoginRequest, RegisterRequest } from '../services/auth';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'applicant' as 'applicant' | 'employer',
    // Applicant fields
    firstName: '',
    lastName: '',
    phoneNumber: '',
    introduction: '',
    // Employer fields
    name: '',
    address: '',
    category: '',
    websiteUrl: '',
  });

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const loginData: LoginRequest = {
          email: formData.email,
          password: formData.password,
        };
        await loginMutation.mutateAsync(loginData);
      } else {
        const registerData: RegisterRequest = {
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
        };

        // Add user type specific fields
        if (formData.userType === 'applicant') {
          registerData.firstName = formData.firstName;
          registerData.lastName = formData.lastName;
          registerData.phoneNumber = formData.phoneNumber;
          registerData.introduction = formData.introduction;
        } else {
          registerData.name = formData.name;
          registerData.address = formData.address;
          registerData.category = formData.category;
          registerData.websiteUrl = formData.websiteUrl;
        }

        await registerMutation.mutateAsync(registerData);
      }

      onLoginSuccess();
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;
  const error = loginMutation.error || registerMutation.error;

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4'>
      <div className='max-w-md w-full'>
        {/* Logo and Header */}
        <div className='text-center mb-8'>
          <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4'>
            <span className='text-white font-bold text-2xl'>J</span>
          </div>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Jobbsie
          </h1>
          <p className='text-gray-600 mt-2'>
            {isLogin ? 'Welcome back!' : 'Join us today!'}
          </p>
        </div>

        {/* Form */}
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          {/* Tab Switcher */}
          <div className='flex bg-gray-100 rounded-lg p-1 mb-6'>
            <button
              type='button'
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Login
            </button>
            <button
              type='button'
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                !isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-700 text-sm'>
                {(error as any)?.response?.data?.message ||
                  'Authentication failed. Please try again.'}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* User Type Selection (Register only) */}
            {!isLogin && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  I am a:
                </label>
                <select
                  name='userType'
                  value={formData.userType}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  required
                >
                  <option value='applicant'>Job Seeker</option>
                  <option value='employer'>Employer</option>
                </select>
              </div>
            )}

            {/* Applicant Fields (Register only) */}
            {!isLogin && formData.userType === 'applicant' && (
              <>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      First Name
                    </label>
                    <input
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Last Name
                    </label>
                    <input
                      type='text'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    name='phoneNumber'
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Introduction (Optional)
                  </label>
                  <textarea
                    name='introduction'
                    value={formData.introduction}
                    onChange={handleInputChange}
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Tell employers about yourself...'
                  />
                </div>
              </>
            )}

            {/* Employer Fields (Register only) */}
            {!isLogin && formData.userType === 'employer' && (
              <>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Company Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Address
                  </label>
                  <input
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Industry Category
                  </label>
                  <input
                    type='text'
                    name='category'
                    value={formData.category}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='e.g., Technology, Healthcare, Finance'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Website URL (Optional)
                  </label>
                  <input
                    type='url'
                    name='websiteUrl'
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='https://example.com'
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  required
                  minLength={6}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                >
                  {showPassword ? (
                    <EyeSlashIcon className='h-5 w-5 text-gray-400' />
                  ) : (
                    <EyeIcon className='h-5 w-5 text-gray-400' />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center'
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size='small' className='mr-2' />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
            <p className='text-xs text-gray-600 text-center'>
              Demo credentials:
              <br />
              <strong>Email:</strong> demo@example.com
              <br />
              <strong>Password:</strong> demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
