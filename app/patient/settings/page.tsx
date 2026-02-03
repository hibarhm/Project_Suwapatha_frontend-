'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function PatientSettingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: 'Jane Doe',
    username: 'janedoe'
  });
  const [email, setEmail] = useState('jane.doe@example.com');
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });

   const handleLogout = () => {
    // Redirect to homepage
    router.push('/');
  };
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
       <div className="p-6 border-b border-gray-200">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-indigo-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-indigo-700 whitespace-nowrap">Suwapatha</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/patient/dashboard">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="whitespace-nowrap">Dashboard</span>
            </button>
          </Link>

          <Link href="/patient/appointments">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="whitespace-nowrap">Appointments</span>
            </button>
          </Link>

          <Link href="/patient/records">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="whitespace-nowrap">Medical Records</span>
            </button>
          </Link>

          <Link href="/patient/settings">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors bg-indigo-700 text-white">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="whitespace-nowrap">Settings</span>
            </button>
          </Link>
        </nav>

         {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="whitespace-nowrap">Log Out</span>
          </button>
        </div>

        <div className="p-4 flex gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Settings Content */}
        <div className="p-8 max-w-5xl mx-auto space-y-8">
          {/* Profile Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
              <p className="text-sm text-gray-600 mt-1">Update your photo, full name, and username.</p>
            </div>

            {/* Profile Photo */}
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                JD
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Profile Photo</h3>
                <p className="text-xs text-gray-500 mb-3">JPG, GIF or PNG. Max size of 800K</p>
                <button className="text-sm font-medium text-indigo-700 hover:text-indigo-800">
                  Change Photo
                </button>
              </div>
            </div>

            {/* Name and Username */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700 text-sm text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700 text-sm text-gray-900"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2.5 bg-indigo-700 text-white rounded-lg text-sm font-medium hover:bg-indigo-800 transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          {/* Email Address */}
          <div className="bg-white rounded-xl border-2 border-indigo-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Email Address</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your primary email address and verification status.</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700 text-sm text-gray-900"
                  disabled
                />
              </div>
            </div>

            <div className="mb-6">
              <span className="text-sm font-semibold text-gray-900 mr-3">Status:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                Verified
              </span>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2.5 bg-indigo-700 text-white rounded-lg text-sm font-medium hover:bg-indigo-800 transition-colors">
                Change Email
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Password</h2>
              <p className="text-sm text-gray-600 mt-1">Change your account password.</p>
            </div>

            <div className="space-y-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700 text-sm text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700 text-sm text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700 text-sm text-gray-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2.5 bg-indigo-700 text-white rounded-lg text-sm font-medium hover:bg-indigo-800 transition-colors">
                Update Password
              </button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
              <p className="text-sm text-gray-600 mt-1">Choose how you receive updates and alerts.</p>
            </div>

            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-start justify-between py-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive important updates and announcements via email.</p>
                </div>
                <button
                  onClick={() => setNotifications({...notifications, email: !notifications.email})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    notifications.email ? 'bg-indigo-700' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.email ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-start justify-between py-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Get real-time alerts and reminders on your phone.</p>
                </div>
                <button
                  onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    notifications.sms ? 'bg-indigo-700' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.sms ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Push Notifications */}
              <div className="flex items-start justify-between py-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Instant notifications directly to your device or browser.</p>
                </div>
                <button
                  onClick={() => setNotifications({...notifications, push: !notifications.push})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    notifications.push ? 'bg-indigo-700' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.push ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Account Management</h2>
              <p className="text-sm text-gray-600 mt-1">Options to manage or delete your account.</p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-700">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>

            <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}