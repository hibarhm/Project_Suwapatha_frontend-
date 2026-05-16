'use client';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import { useState } from 'react';
import {Link, useRouter} from '@/i18n/navigation';
import { authApi, ApiError } from '@/app/api/auth/authApi';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

export default function LoginPage() {
  const t = useTranslations('login');
  const router = useRouter();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
    rememberMe: false,
    role: 'Patient',
    useLocation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.role === 'Patient') {
        // Call patient login API
        const response = await authApi.loginPatient({
          email: formData.usernameOrEmail,
          password: formData.password,
        });

        // Redirect to patient dashboard on success
        router.push('/patient/dashboard');
      } else if (formData.role === 'Doctor') {
        // Call doctor login API
        const response = await authApi.loginDoctor({
          doctorId: formData.usernameOrEmail,
          password: formData.password,
        });

        // Redirect to doctor dashboard on success
        router.push('/doctor/dashboard');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t('errors.unexpected'));
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleRoleSelect = (role: string) => {
    setFormData({
      ...formData,
      role: role,
    });
  };

  const handleLocationSelect = (choice: string) => {
    setFormData({
      ...formData,
      useLocation: choice,
    });

    if (choice === 'Yes') {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            localStorage.setItem('userLat', latitude.toString());
            localStorage.setItem('userLng', longitude.toString());
            localStorage.setItem('locationPermission', 'granted');
            console.log('Location captured:', latitude, longitude);
          },
          (error) => {
            console.error('Geolocation error:', error);
            localStorage.setItem('locationPermission', 'denied');
            // We can show a toast or alert if needed, but the user requirement just says capture if possible
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        console.error('Geolocation not supported');
        localStorage.setItem('locationPermission', 'unsupported');
      }
    } else {
      localStorage.setItem('locationPermission', 'denied');
      localStorage.removeItem('userLat');
      localStorage.removeItem('userLng');
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
              {t('nav.home')}
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-[#94B4C1] transition-colors">
              {t('nav.about')}
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#94B4C1] transition-colors">
              {t('nav.contact')}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/"
              className="bg-[#94B4C1] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#7fa8b8] transition-colors shadow-sm"
            >
              {t('nav.getStarted')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Section */}
      <section className="pt-24 pb-12 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Left side - Image */}
            <div className="relative h-[500px] lg:h-[700px] rounded-xl overflow-hidden border-4 border-[#94B4C1]/30">
              <Image
                src="/doctor-patient.jpg"
                alt="Doctor holding patient's hand"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Right side - Login Form */}
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

              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('title')}</h2>
              <p className="text-sm text-gray-600 mb-6">{t('subtitle')}</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username/Email */}
                <div>
                  <label htmlFor="usernameOrEmail" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    {t('form.usernameLabel')}
                  </label>
                  <input
                    type="text"
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                    placeholder={t('form.usernamePlaceholder')}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    {t('form.passwordLabel')}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('form.passwordPlaceholder')}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all"
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
                      className="w-4 h-4 text-[#94B4C1] border-gray-300 rounded focus:ring-[#94B4C1]"
                    />
                    <span className="text-sm text-gray-700">{t('form.rememberMe')}</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-[#94B4C1] hover:text-[#7fa8b8] font-medium">
                    {t('form.forgotPassword')}
                  </Link>
                </div>

                {/* Use my location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    {t('form.locationQuestion')}
                  </label>
                  <p className="text-xs text-gray-600 mb-2">
                    {t('form.locationHelp')}
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleLocationSelect('Yes')}
                      className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${formData.useLocation === 'Yes'
                        ? 'bg-[#94B4C1] text-white'
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#94B4C1]'
                        }`}
                    >
                      {t('form.yes')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLocationSelect('No')}
                      className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${formData.useLocation === 'No'
                        ? 'bg-[#94B4C1] text-white'
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#94B4C1]'
                        }`}
                    >
                      {t('form.no')}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#94B4C1] text-white py-3 rounded-lg font-semibold hover:bg-[#7fa8b8] transition-colors shadow-md hover:shadow-lg text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('form.loggingIn') : t('form.login')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}