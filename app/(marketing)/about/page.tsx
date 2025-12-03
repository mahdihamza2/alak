import { Metadata } from 'next';
import { Building2, Users, Target, Award } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Alak Oil and Gas Company Limited, our mission, values, and executive leadership team.',
};

export default function AboutPage() {
  const executives = [
    {
      name: 'Kabiru Jibril',
      title: 'Executive Chief Officer',
      bio: 'With over 15 years of experience in the energy sector, Kabiru leads Alak\'s strategic vision and regulatory compliance initiatives. His expertise in international trade and commitment to transparency has positioned Alak as Nigeria\'s most trusted energy intermediary.',
      image: '/images/executives/kabiru-jibril.jpg',
      linkedin: '#',
    },
    {
      name: 'Aliyu Ahmad Sunusi',
      title: 'Managing Director',
      bio: 'Aliyu brings extensive knowledge in petroleum product distribution and logistics operations. His operational excellence and focus on risk management ensure seamless transactions and client satisfaction across all Alak partnerships.',
      image: '/images/executives/aliyu-ahmad-sunusi.jpg',
      linkedin: '#',
    },
  ];

  const values = [
    {
      icon: Building2,
      title: 'Integrity',
      description: 'We operate with complete transparency, displaying our regulatory credentials prominently and maintaining the highest ethical standards.',
    },
    {
      icon: Users,
      title: 'Trust',
      description: 'Building lasting relationships through verified credentials, proven track records, and consistent delivery on our commitments.',
    },
    {
      icon: Target,
      title: 'Professionalism',
      description: 'Delivering excellence in every transaction with meticulous attention to compliance, documentation, and client service.',
    },
    {
      icon: Award,
      title: 'Global Reach',
      description: 'Connecting Nigerian energy resources with international markets through strategic partnerships and verified networks.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('/images/refinery_image (2).jpg')" }}
        />
        {/* Gradient Overlay for professional look */}
        <div className="absolute inset-0 bg-linear-to-b from-navy-950/70 via-navy-950/60 to-navy-950/80" />
        <div className="absolute inset-0 bg-linear-to-r from-navy-950/40 to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in drop-shadow-lg">
            About <span className="text-gold-500">Alak Oil & Gas</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Nigeria's most transparent energy intermediary, established in 2018 with a commitment to regulatory excellence and verified partnerships.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Founded in 2018, Alak Oil and Gas Company Limited emerged from a vision to transform the Nigerian energy intermediary landscape through unprecedented transparency and regulatory compliance.
                </p>
                <p>
                  While many companies in our sector operate with minimal disclosure, we took a different path. From day one, we've prominently displayed our Corporate Affairs Commission registration (RC: 8867061) and Tax Identification Number (TIN: 33567270-0001), setting a new standard for accountability.
                </p>
                <p>
                  Our dual presence in Nigeria's key business centers—with our head office in Abuja and commercial office in Lagos—enables us to serve both domestic and international clients with unmatched efficiency and local expertise.
                </p>
                <p className="font-semibold text-blue-700">
                  Today, we facilitate verified connections between buyers and sellers of crude oil and refined petroleum products, reducing transaction risk through our intelligent qualification system and comprehensive compliance framework.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl font-bold text-navy-950 mb-4">2018</div>
                  <div className="text-xl font-semibold text-slate-700 mb-2">Established</div>
                  <div className="text-sm text-slate-600 max-w-xs mx-auto">
                    Setting new standards for transparency in Nigeria's energy sector
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              The principles that guide every decision and transaction at Alak Oil & Gas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-blue-700 rounded-lg flex items-center justify-center mb-6">
                  <value.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Leadership */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Executive Leadership
            </h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              Meet the experienced professionals guiding Alak's strategic vision and operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {executives.map((exec, index) => (
              <div
                key={index}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-24 h-24 bg-linear-to-br from-blue-700 to-navy-950 rounded-xl flex items-center justify-center text-white text-3xl font-bold shrink-0">
                    {exec.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">
                      {exec.name}
                    </h3>
                    <p className="text-gold-600 font-semibold mb-3">
                      {exec.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-success rounded-full" />
                      <span className="text-sm text-slate-600 font-mono">Verified Profile</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed mb-6">
                  {exec.bio}
                </p>
                <a
                  href={exec.linkedin}
                  className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-gold-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  View LinkedIn Profile
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory Credentials CTA */}
      <section className="py-20 px-6 gradient-navy grid-pattern">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-text-light-primary mb-6">
            Verify Our Credentials
          </h2>
          <p className="text-xl text-text-light-secondary mb-8">
            Unlike most competitors, we display our full regulatory documentation publicly. See for yourself.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/compliance"
              className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              View Compliance Documents
            </a>
            <a
              href="/contact"
              className="px-8 py-4 border-2 border-text-light-primary text-text-light-primary font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Contact Our Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
