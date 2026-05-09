'use client';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import { useState } from 'react';
import {Link, useRouter} from '@/i18n/navigation';
import { authApi, ApiError } from '@/app/api/auth/authApi';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

export default function DoctorLoginPage() {
  const t = useTranslations('doctorLogin');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    doctorIdOrEmail: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Determine if it's an email or doctor ID
      const isEmail = formData.doctorIdOrEmail.includes('@');

      if (isEmail) {
        await authApi.login({
          email: formData.doctorIdOrEmail,
          password: formData.password
        });
      } else {
        await authApi.loginDoctor({
          doctorId: formData.doctorIdOrEmail,
          password: formData.password
        });
      }

      // Redirect to doctor dashboard
      router.push('/doctor/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err.message || t('errors.invalidCredentials'));
      }
    } finally {
      setLoading(false);
    }
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
            <span className="text-xl font-bold text-gray-900">{t('brand')}</span>
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
            <div className="relative h-[500px] lg:h-[650px] rounded-xl overflow-hidden border-4 border-[#94B4C1]/30">
              <Image
                src="/doctor-patient.jpg"
                alt={t('imageAlt')}
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-[#94B4C1]">{t('brand')}</h1>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('title')}</h2>
              <p className="text-sm text-gray-600 mb-6">{t('subtitle')}</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Doctor ID/Email */}
                <div>
                  <label htmlFor="doctorIdOrEmail" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    {t('form.doctorIdOrEmailLabel')}
                  </label>
                  <input
                    type="text"
                    id="doctorIdOrEmail"
                    name="doctorIdOrEmail"
                    value={formData.doctorIdOrEmail}
                    onChange={handleChange}
                    placeholder={t('form.doctorIdOrEmailPlaceholder')}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all"
                    required
                    disabled={loading}
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
                    disabled={loading}
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
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700">{t('form.rememberMe')}</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-[#94B4C1] hover:text-[#7fa8b8] font-medium">
                    {t('form.forgotPassword')}
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-[#94B4C1] text-white py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg text-sm mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#7fa8b8]'
                    }`}
                >
                  {loading ? t('form.loggingIn') : t('form.loginButton')}
                </button>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-600 pt-2">
                  {t('form.notRegistered')}{' '}
                  <Link href="/register/doctor" className="text-[#94B4C1] hover:text-[#7fa8b8] font-medium">
                    {t('form.registerLink')}
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