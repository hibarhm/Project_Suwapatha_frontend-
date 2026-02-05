'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function PatientRegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    nic: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle registration logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

              <h2 className="text-xl font-bold text-gray-900 mb-6">Registration Form</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="john.doe"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all"
                    required
                  />
                </div>

                {/* NIC */}
                <div>
                  <label htmlFor="nic" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    NIC (National Identity Card)
                  </label>
                  <input
                    type="text"
                    id="nic"
                    name="nic"
                    value={formData.nic}
                    onChange={handleChange}
                    placeholder="90123456V"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94 77 123 4567"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all"
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all appearance-none bg-white cursor-pointer"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#94B4C1] text-white py-3 rounded-lg font-semibold hover:bg-[#7fa8b8] transition-colors shadow-md hover:shadow-lg text-sm mt-2"
                >
                  Register
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