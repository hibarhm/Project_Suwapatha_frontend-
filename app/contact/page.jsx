'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#94B4C1] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#94B4C1]">Suwapatha</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-[#94B4C1] transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-[#94B4C1] transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-900 font-medium hover:text-[#94B4C1] transition-colors">
              Contact
            </Link>
          </div>
          <button className="bg-[#94B4C1] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#7fa8b8] transition-colors shadow-sm">
            Get Started
          </button>
        </div>
      </nav>

      {/* Contact Form Section */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Send Us a Message
            </h1>
            <p className="text-gray-600">
              Have a question or need assistance? We're here to help.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-gray-900 placeholder-gray-400 text-sm transition-colors"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-gray-900 placeholder-gray-400 text-sm transition-colors"
                  required
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-gray-900 placeholder-gray-400 text-sm transition-colors"
                  required
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here."
                  rows="6"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-gray-900 placeholder-gray-400 text-sm resize-none transition-colors"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#94B4C1] hover:bg-[#7fa8b8] text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Additional Contact Info */}
          <div className="mt-12 text-center space-y-3">
            <p className="text-sm text-gray-600">Or reach us directly:</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <a href="mailto:info@suwapatha.gov.lk" className="flex items-center gap-2 text-gray-700 hover:text-[#94B4C1] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@suwapatha.gov.lk
              </a>
              <span className="hidden sm:block text-gray-300">|</span>
              <a href="tel:+94112345678" className="flex items-center gap-2 text-gray-700 hover:text-[#94B4C1] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +94 11 234 5678
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#A1C2BD]/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Left - Brand */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Suwapatha</h3>
              <p className="text-sm text-gray-600">
                © 2026 Government of Sri Lanka. All rights reserved.
              </p>
            </div>

            {/* Middle - Links */}
            <div className="space-y-4">
              <nav className="flex flex-col space-y-3">
                <Link href="/" className="text-gray-900 font-medium hover:text-[#94B4C1] transition-colors">
                  Home
                </Link>
                <Link href="/about" className="text-gray-900 font-medium hover:text-[#94B4C1] transition-colors">
                  About Us
                </Link>
                <Link href="#" className="text-gray-900 font-medium hover:text-[#94B4C1] transition-colors">
                  Services
                </Link>
                <Link href="#" className="text-gray-900 font-medium hover:text-[#94B4C1] transition-colors">
                  FAQ
                </Link>
                <Link href="/contact" className="text-gray-900 font-medium hover:text-[#94B4C1] transition-colors">
                  Contact Us
                </Link>
              </nav>
            </div>

            {/* Right - Accessibility */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Accessibility Statement</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Committed to providing an accessible online experience.
              </p>
              <Link href="#" className="inline-flex items-center gap-2 text-[#94B4C1] hover:text-[#7fa8b8] font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}