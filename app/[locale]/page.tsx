import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Navbar from '@/app/components/Navbar';

export default function Home() {
  const t = useTranslations('home');

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-[#19183B]">
                {t('hero.title')}{' '}
                <span className="text-[#94B4C1]">{t('hero.titleHighlight')}</span>
              </h1>
              <p className="text-base text-gray-600 leading-relaxed max-w-xl">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-3 pt-3">
                <Link href="/register/patient">
                  <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-5 py-2.5 rounded-lg font-medium text-gray-900 transition-colors border border-gray-200 text-sm">
                    {t('hero.asPatient')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </Link>
                <Link href="/register/doctor">
                  <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-5 py-2.5 rounded-lg font-medium text-gray-900 transition-colors border border-gray-200 text-sm">
                    {t('hero.asDoctor')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </Link>
              </div>
              <div className="flex gap-2 pt-2">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/doctors.png"
                  alt={t('hero.doctorsImageAlt')}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#6a8a96] py-16 px-6 relative overflow-hidden">
        <div className="absolute top-8 right-8 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-[#94B4C1]"></div>
          <div className="w-2 h-2 rounded-full bg-[#94B4C1]"></div>
          <div className="w-2 h-2 rounded-full bg-[#94B4C1]"></div>
        </div>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-12">
            {t('features.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 space-y-3 hover:transform hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-[#A1C2BD]/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {t('features.unified.title')}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('features.unified.description')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 space-y-3 hover:transform hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-[#A1C2BD]/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {t('features.queue.title')}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('features.queue.description')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 space-y-3 hover:transform hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-[#A1C2BD]/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {t('features.care.title')}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('features.care.description')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 space-y-3 hover:transform hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-[#A1C2BD]/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {t('features.multilingual.title')}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('features.multilingual.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OPD Booking Steps Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-16">
            {t('steps.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-[#94B4C1]/10 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {t('steps.step1.label')}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('steps.step1.title')}
                </h3>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-[#94B4C1]/10 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {t('steps.step2.label')}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('steps.step2.title')}
                </h3>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-[#94B4C1]/10 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {t('steps.step3.label')}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('steps.step3.title')}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-16">
            {t('commitment.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left side - Trust badges */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#94B4C1]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{t('commitment.government')}</h3>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{t('commitment.secure')}</h3>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#94B4C1]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{t('commitment.accessible')}</h3>
                </div>
              </div>
            </div>

            {/* Right side - Contact info */}
            <div className="bg-gray-50 rounded-2xl p-8 space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">{t('contact.title')}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@suwapatha.gov.lk" className="text-gray-700 hover:text-[#94B4C1] transition-colors">
                    info@suwapatha.gov.lk
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+94112345678" className="text-gray-700 hover:text-[#94B4C1] transition-colors">
                    +94 11 234 5678
                  </a>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pt-2">
                {t('contact.supportText')}
              </p>
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
                <Link href="#" className="text-gray-900 font-medium hover:text-[#94B4C1] transition-colors">
                  {t('footer.home')}
                </Link>
                <Link href="#" className="text-gray-900 font-medium hover:text-[#94B4C1] transition-colors">
                  {t('footer.about')}
                </Link>
                <Link href="#" className="text-gray-900 font-medium hover:text-[#94B4C1] transition-colors">
                  {t('footer.services')}
                </Link>
                <Link href="#" className="text-gray-900 font-medium hover:text-[#94B4C1] transition-colors">
                  {t('footer.contact')}
                </Link>
              </nav>
            </div>
            {/* Right - Accessibility */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">{t('footer.accessibilityTitle')}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('footer.accessibilityDescription')}
              </p>
              <Link href="#" className="inline-flex items-center gap-2 text-[#94B4C1] hover:text-[#7fa8b8] font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {t('footer.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}