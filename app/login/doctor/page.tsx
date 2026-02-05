'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function DoctorLoginPage() {
  const [formData, setFormData] = useState({
    doctorIdOrEmail: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Doctor login submitted:', formData);
    // Handle login logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Suwapatha</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-indigo-700 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-indigo-700 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-indigo-700 transition-colors">
              Contact
            </Link>
          </div>

          <Link href="/" className="bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-800 transition-colors shadow-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Login Section */}
      <section className="pt-24 pb-12 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Left side - Image */}
            <div className="relative h-[500px] lg:h-[650px] rounded-xl overflow-hidden border-4 border-indigo-300">
              <Image
                src="/doctor-patient.jpg"
                alt="Professional doctor"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Right side - Login Form */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 lg:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-indigo-700 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-indigo-700">Suwapatha</h1>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">Doctor Login</h2>
              <p className="text-sm text-gray-600 mb-6">Access your healthcare professional account</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Doctor ID/Email */}
                <div>
                  <label htmlFor="doctorIdOrEmail" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Doctor ID / Email
                  </label>
                  <input
                    type="text"
                    id="doctorIdOrEmail"
                    name="doctorIdOrEmail"
                    value={formData.doctorIdOrEmail}
                    onChange={handleChange}
                    placeholder="Enter your Doctor ID or email"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-indigo-700 hover:text-indigo-800 font-medium">
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full bg-indigo-700 text-white py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors shadow-md hover:shadow-lg text-sm mt-4"
                >
                  Login as Doctor
                </button>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-600 pt-2">
                  Not registered yet?{' '}
                  <Link href="/register/doctor" className="text-indigo-700 hover:text-indigo-800 font-medium">
                    Register as Doctor
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