'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import Navbar from '@/app/components/Navbar';

export default function AboutPage() {
  const t = useTranslations('about');
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="border-4 border-[#94B4C1]/30 rounded-3xl p-12 lg:p-16 bg-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Text */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-[#04090a] leading-tight">
                  {t('title')}
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('description')}
                </p>
                <div className="flex gap-2 pt-4">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                </div>
              </div>

              {/* Right side - Image */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200">
                  <Image
                    src="/Healthcare.jpg"
                    alt="Healthcare professional"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* {t('whatIsTitle')}Suwapatha Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
            What is <span className="text-[#94B4C1]">{t('whatIsHighlight')} </span>
          </h2>
          <p className="text-lg text-gray-600 text-center leading-relaxed mb-16">
            {t('whatIsDescription')}
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#94B4C1]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#94B4C1]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('features.effortless')}
                </h3>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#94B4C1]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#94B4C1]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('features.secure')}
                </h3>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#94B4C1]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#94B4C1]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('features.reduced')}
                </h3>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#94B4C1]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#94B4C1]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('features.enhanced')}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* {t('keyFeaturesTitle')} Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-16">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-[#94B4C1]/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t('keyFeatures.unified.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('keyFeatures.unified.description')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-[#94B4C1]/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t('keyFeatures.realtime.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('keyFeatures.realtime.description')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-[#94B4C1]/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t('keyFeatures.eMedical.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('keyFeatures.eMedical.description')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-[#94B4C1]/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t('keyFeatures.multilingual.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('keyFeatures.multilingual.description')}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-[#94B4C1]/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t('keyFeatures.accessibility.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('keyFeatures.accessibility.description')}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-[#94B4C1]/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t('keyFeatures.secureIdentity.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('keyFeatures.secureIdentity.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* {t('governanceTitle')} Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
            Governance & Data Privacy
          </h2>
          <p className="text-lg text-gray-600 text-center leading-relaxed mb-12">
            {t('governanceDescription')}
          </p>

          {/* Privacy Points */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-[#94B4C1]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#94B4C1]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t('governancePoints.adherence')}
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-[#94B4C1]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#94B4C1]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t('governancePoints.encryption')}
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-[#94B4C1]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#94B4C1]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t('governancePoints.access')}
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-[#94B4C1]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#94B4C1]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t('governancePoints.policies')}
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-[#94B4C1]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#94B4C1]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t('governancePoints.audits')}
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
              <h3 className="text-xl font-bold text-[#94B4C1]">Suwapatha</h3>
              <p className="text-sm text-gray-600">
                {t('footer.rights')}
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
              <h3 className="text-xl font-bold text-gray-900">{t('footer.accessibility')}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('footer.accessibilityDesc')}
              </p>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-[#94B4C1] hover:text-[#7fa8b8] font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
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