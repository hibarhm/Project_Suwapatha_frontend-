'use client';

import Image from 'next/image';
import {useTranslations} from 'next-intl';
import { useState, useEffect } from 'react';
import {Link, useRouter} from '@/i18n/navigation';
import { authApi, ApiError } from '../../api/auth/authApi';
import { appointmentApi } from '../../api/appointment/appointmentApi';
import { HospitalResponse } from '../../api/appointment/appointmentTypes';
import SearchableSelect from '../../components/SearchableSelect';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

export default function DoctorRegisterPage() {
  const t = useTranslations('doctorRegister');
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    doctorId: '',
    nic: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    hospitalId: '',
  });

  const [hospitals, setHospitals] = useState<HospitalResponse[]>([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await appointmentApi.getHospitals();
        setHospitals(data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        setApiError(t('errors.hospitalsLoadFailed'));
      } finally {
        setIsLoadingHospitals(false);
      }
    };
    fetchHospitals();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('errors.firstNameRequired');
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('errors.lastNameRequired');
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('errors.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('errors.passwordLength');
    }

    // Doctor ID validation
    if (!formData.doctorId.trim()) {
      newErrors.doctorId = t('errors.doctorIdRequired');
    }

    // NIC validation
    if (!formData.nic.trim()) {
      newErrors.nic = t('errors.nicRequired');
    } else if (!/^([0-9]{9}[VvXx]|[0-9]{12})$/.test(formData.nic)) {
      newErrors.nic = t('errors.nicInvalid');
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = t('errors.phoneRequired');
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = t('errors.phoneDigits');
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = t('errors.genderRequired');
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t('errors.dateOfBirthRequired');
    }

    // Hospital validation
    if (!formData.hospitalId) {
      newErrors.hospitalId = t('errors.hospitalRequired');
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
      await authApi.registerDoctor(formData);
      // Registration successful - token is automatically stored by authApi
      router.push('/doctor/pendingApproval');
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError(t('errors.unexpected'));
      }
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

      {/* Registration Section */}
      <section className="pt-24 pb-12 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Left side - Image */}
            <div className="relative h-[500px] lg:h-[900px] rounded-xl overflow-hidden">
              <Image
                src="/surgery.jpg"
                alt={t('imageAlt')}
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-[#94B4C1]">{t('brand')}</h1>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('title')}</h2>
              <p className="text-sm text-gray-600 mb-5">{t('subtitle')}</p>

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
                      {t('form.firstName')}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder={t('form.firstNamePlaceholder')}
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 mb-1.5">
                      {t('form.lastName')}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder={t('form.lastNamePlaceholder')}
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    {t('form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('form.emailPlaceholder')}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    {t('form.password')}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('form.passwordPlaceholder')}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Doctor ID Number */}
                <div>
                  <label htmlFor="doctorId" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    {t('form.doctorId')}
                  </label>
                  <input
                    type="text"
                    id="doctorId"
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    placeholder={t('form.doctorIdPlaceholder')}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all ${errors.doctorId ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.doctorId && <p className="text-red-500 text-xs mt-1">{errors.doctorId}</p>}
                  <p className="text-xs text-gray-500 mt-1">{t('form.doctorIdHint')}</p>
                </div>

                {/* NIC */}
                <div>
                  <label htmlFor="nic" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    {t('form.nic')}
                  </label>
                  <input
                    type="text"
                    id="nic"
                    name="nic"
                    value={formData.nic}
                    onChange={handleChange}
                    placeholder={t('form.nicPlaceholder')}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all ${errors.nic ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.nic && <p className="text-red-500 text-xs mt-1">{errors.nic}</p>}
                  <p className="text-xs text-gray-500 mt-1">{t('form.nicHint')}</p>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    {t('form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('form.phonePlaceholder')}
                    maxLength={10}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  <p className="text-xs text-gray-500 mt-1">{t('form.phoneHint')}</p>
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    {t('form.gender')}
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-[#94B4C1] outline-none transition-all appearance-none bg-white cursor-pointer ${errors.gender ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <option value="Male">{t('form.genderMale')}</option>
                    <option value="Female">{t('form.genderFemale')}</option>
                    <option value="Other">{t('form.genderOther')}</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    {t('form.dateOfBirth')}
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

                {/* Hospital Selection */}
                <SearchableSelect
                  label={t('form.hospital')}
                  options={hospitals.map(h => ({
                    id: h.id,
                    name: h.name,
                    subtitle: `${h.district}, ${h.province}`
                  }))}
                  value={formData.hospitalId}
                  onChange={(value) => {
                    setFormData({ ...formData, hospitalId: value });
                    if (errors.hospitalId) {
                      setErrors({ ...errors, hospitalId: '' });
                    }
                  }}
                  placeholder={t('form.hospitalPlaceholder')}
                  searchPlaceholder={t('form.hospitalSearchPlaceholder')}
                  noResultsText={t('form.hospitalNoResults')}
                  loading={isLoadingHospitals}
                  error={errors.hospitalId}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#94B4C1] text-white py-3 rounded-lg font-semibold hover:bg-[#7fa8b8] transition-colors shadow-md hover:shadow-lg text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('form.registering') : t('form.register')}
                </button>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600 pt-1">
                  {t('form.alreadyRegistered')}{' '}
                  <Link href="/login/doctor" className="text-[#94B4C1] hover:text-[#7fa8b8] font-medium">
                    {t('form.loginLink')}
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