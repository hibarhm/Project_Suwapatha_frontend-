'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, ApiError } from '../../api/auth/authApi';

export default function PatientRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    phoneNumber: '',
    address: '',
    emergencyContact: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    // Phone number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      await authApi.registerPatient(formData);
      // Registration successful - token is automatically stored by authApi
      // Redirect directly to patient dashboard
      router.push('/patient/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#94B4C1] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Suwapatha</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-[#94B4C1] transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-[#94B4C1] transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#94B4C1] transition-colors">
              Contact
            </Link>
          </div>
          <Link
            href="/"
            className="bg-[#94B4C1] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#7fa8b8] transition-colors shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Registration Section */}
      <section className="pt-24 pb-12 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Left side - Image */}
            <div className="relative h-[500px] lg:h-[780px] rounded-xl overflow-hidden">
              <Image
                src="/surgery.jpg"
                alt="Medical professionals in surgery"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Right side - Registration Form */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 lg:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-[#94B4C1] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-[#94B4C1]">Suwapatha</h1>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-6">Patient Registration</h2>

              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="0771234567"
                    maxLength={10}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                  <p className="text-xs text-gray-500 mt-1">Enter 10 digits (e.g., 0771234567)</p>
                </div>

                {/* Date of Birth & Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-900 mb-1.5">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-semibold text-gray-900 mb-1.5">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all appearance-none bg-white cursor-pointer ${errors.gender ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street, Colombo 07"
                    rows={2}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all resize-none ${errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                {/* Emergency Contact */}
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Emergency Contact (Optional)
                  </label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="Name and phone number"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#94B4C1] text-white py-3 rounded-lg font-semibold hover:bg-[#7fa8b8] transition-colors shadow-md hover:shadow-lg text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </button>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600 pt-1">
                  Already registered?{' '}
                  <Link href="/login" className="text-[#94B4C1] hover:text-[#7fa8b8] font-medium">
                    Log in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}