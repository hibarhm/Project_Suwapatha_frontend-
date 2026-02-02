import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
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
            <Link href="/about" className="text-gray-900 font-medium hover:text-indigo-700 transition-colors">
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="border-4 border-indigo-300 rounded-3xl p-12 lg:p-16 bg-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Text */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Suwapatha
                </h1>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Empowering citizens with seamless digital healthcare, connecting you to government health services efficiently and securely.
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

      {/* What is Suwapatha Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
            What is Suwapatha?
          </h2>

          <p className="text-lg text-gray-600 text-center leading-relaxed mb-16">
            Suwapatha is Sri Lanka's pioneering digital health platform, designed to revolutionize access to public healthcare services. We seamlessly connect citizens with government hospitals and health professionals, making healthcare more accessible, efficient, and patient-centric than ever before. Our platform simplifies everything from appointments to medical records, all while upholding the highest standards of data security and privacy.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Effortless Appointment Management
                </h3>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Secure Digital Health Records
                </h3>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Reduced Waiting Times
                </h3>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Enhanced Accessibility for All
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-16">
            Key Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Unified OPD Channeling
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Book and manage outpatient department appointments across all government hospitals with ease.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Real-time Queue Status
              </h3>
              <p className="text-gray-600 leading-relaxed">
                View live waiting times at clinics and pharmacies, saving you valuable time and effort.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                e-Medical Book
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Access your digital medical records securely, including prescriptions, reports, and health history.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Multilingual Support
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Available in Sinhala, Tamil, and English to serve all communities across the island.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Accessibility Features
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Designed for inclusivity with features catering to diverse needs and abilities.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Secure Patient Identity
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Verify your identity and access services with a robust and secure digital patient ID system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Governance & Data Privacy Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
            Governance & Data Privacy
          </h2>

          <p className="text-lg text-gray-600 text-center leading-relaxed mb-12">
            At Suwapatha, safeguarding your personal and health information is our utmost priority. We are committed to maintaining the highest standards of privacy and security, adhering strictly to all national regulations and international best practices for data protection. Your trust is paramount, and we employ robust measures to ensure your data remains confidential and secure.
          </p>

          {/* Privacy Points */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Adherence to national data privacy laws and healthcare regulations.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Secure encryption protocols for all patient data transmission and storage.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Strict access controls ensuring only authorized personnel can view sensitive information.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Transparent policies on data usage, with explicit patient consent for data sharing.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Regular security audits and updates to protect against emerging threats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Left - Brand */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Suwapatha</h3>
              <p className="text-sm text-gray-600">
                © 2024 Government of Sri Lanka. All rights reserved.
              </p>
            </div>

            {/* Middle - Links */}
            <div className="space-y-4">
              <nav className="flex flex-col space-y-3">
                <Link href="/" className="text-gray-900 font-medium hover:text-indigo-700 transition-colors">
                  Home
                </Link>
                <Link href="/about" className="text-gray-900 font-medium hover:text-indigo-700 transition-colors">
                  About Us
                </Link>
                <Link href="#" className="text-gray-900 font-medium hover:text-indigo-700 transition-colors">
                  Services
                </Link>
                <Link href="#" className="text-gray-900 font-medium hover:text-indigo-700 transition-colors">
                  FAQ
                </Link>
                <Link href="/contact" className="text-gray-900 font-medium hover:text-indigo-700 transition-colors">
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
              <Link href="#" className="inline-flex items-center gap-2 text-indigo-700 hover:text-indigo-800 font-medium transition-colors">
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