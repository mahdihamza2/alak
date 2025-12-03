import { Metadata } from 'next';
import { Droplet, Fuel, Plane, CheckCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services - Product Portfolio | Alak Oil and Gas',
  description: 'Crude oil, PMS (gasoline), AGO (diesel), and Jet Fuel (ATK) intermediary services with real-time availability and verified supply chain.',
};

export default function ServicesPage() {
  const products = [
    {
      name: 'Crude Oil',
      icon: Droplet,
      description: 'African and Middle Eastern grades with verified origin certificates',
      grades: ['Bonny Light', 'Brass River', 'Forcados', 'Arab Light', 'Murban'],
      availability: 'high',
      minVolume: '500,000 BBLs',
      delivery: 'FOB/CIF',
      features: [
        'API gravity documentation',
        'Sulfur content certification',
        'Load port inspection',
        'Discharge port verification',
      ],
    },
    {
      name: 'Premium Motor Spirit (PMS)',
      icon: Fuel,
      description: 'Gasoline meeting international quality standards',
      grades: ['Euro V', 'RON 95', 'RON 97'],
      availability: 'medium',
      minVolume: '10,000 MT',
      delivery: 'Ex-Tank/CIF',
      features: [
        'Octane rating verified',
        'Quality certificates included',
        'Tank farm storage available',
        'Coastal delivery logistics',
      ],
    },
    {
      name: 'Automotive Gas Oil (AGO)',
      icon: Fuel,
      description: 'Diesel fuel for industrial and transportation use',
      grades: ['EN 590', '10 PPM', '50 PPM'],
      availability: 'high',
      minVolume: '5,000 MT',
      delivery: 'Ex-Tank/CIF',
      features: [
        'Sulfur content certification',
        'Cetane number documentation',
        'Cold flow properties tested',
        'Bulk distribution network',
      ],
    },
    {
      name: 'Jet Fuel (ATK)',
      icon: Plane,
      description: 'Aviation turbine kerosene for commercial and military aviation',
      grades: ['Jet A-1', 'JP-8'],
      availability: 'medium',
      minVolume: '2,000 MT',
      delivery: 'Into-Plane/Ex-Tank',
      features: [
        'IATA compliance certified',
        'Flash point verification',
        'Freeze point documentation',
        'Airport delivery coordination',
      ],
    },
  ];

  const services = [
    {
      title: 'Buyer-Seller Matching',
      description: 'Intelligent categorization system connecting verified buyers with legitimate sellers through our due diligence process.',
    },
    {
      title: 'Documentation Management',
      description: 'Complete handling of Letters of Intent (LOI), Proof of Product (POP), and all transaction documentation with legal review.',
    },
    {
      title: 'Risk Mitigation',
      description: 'Pre-transaction verification, escrow coordination, and compliance checks to protect all parties in the supply chain.',
    },
    {
      title: 'Logistics Coordination',
      description: 'End-to-end supply chain management from load port inspection to final delivery and discharge confirmation.',
    },
  ];

  const getAvailabilityConfig = (level: string) => {
    switch (level) {
      case 'high':
        return {
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'High Availability',
        };
      case 'medium':
        return {
          icon: Clock,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          label: 'Moderate Availability',
        };
      case 'low':
        return {
          icon: AlertCircle,
          color: 'text-error',
          bgColor: 'bg-error/10',
          label: 'Limited Availability',
        };
      default:
        return {
          icon: Clock,
          color: 'text-slate-500',
          bgColor: 'bg-slate-100',
          label: 'Contact for Status',
        };
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('/images/refinery_image (3).jpg')" }}
        />
        {/* Gradient Overlay for professional look */}
        <div className="absolute inset-0 bg-linear-to-b from-navy-950/70 via-navy-950/60 to-navy-950/80" />
        <div className="absolute inset-0 bg-linear-to-r from-navy-950/40 to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Droplet size={48} className="text-gold-500 drop-shadow-lg" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in drop-shadow-lg">
            Product <span className="text-gold-500">Portfolio</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Crude oil and refined petroleum products with verified supply chains, quality documentation, and transparent pricing.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Available Products
            </h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              Real-time availability status and verified quality certifications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product, index) => {
              const IconComponent = product.icon;
              const availConfig = getAvailabilityConfig(product.availability);
              const AvailIcon = availConfig.icon;

              return (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-700 rounded-lg">
                        <IconComponent size={28} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {product.name}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${availConfig.bgColor} mb-6`}>
                    <AvailIcon size={16} className={availConfig.color} />
                    <span className={`text-sm font-semibold ${availConfig.color}`}>
                      {availConfig.label}
                    </span>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-200">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        Min. Volume
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        {product.minVolume}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        Delivery Terms
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        {product.delivery}
                      </div>
                    </div>
                  </div>

                  {/* Grades */}
                  <div className="mb-6">
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-3">
                      Available Grades
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.grades.map((grade, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-sm rounded-full"
                        >
                          {grade}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-3">
                      Included Services
                    </div>
                    <ul className="space-y-2">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle size={16} className="text-success shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <a
                    href="/contact"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-700 hover:bg-gold-600 text-white font-semibold rounded-lg transition-all duration-300 group"
                  >
                    Request Quote
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How We Serve You
            </h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              End-to-end intermediary services focused on transparency and risk reduction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Our Transaction Process
            </h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              Structured approach ensuring compliance and protecting all parties
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Initial Inquiry & Categorization',
                description: 'Submit inquiry specifying your role (Verified Buyer, Verified Seller, or Strategic Partner) with volume requirements.',
              },
              {
                step: '02',
                title: 'Due Diligence & Verification',
                description: 'We conduct KYC/AML checks, verify financial capacity, and authenticate company documentation for all parties.',
              },
              {
                step: '03',
                title: 'Matching & Introduction',
                description: 'Intelligent matching based on volume, terms, and compliance requirements with formal introduction and NDA execution.',
              },
              {
                step: '04',
                title: 'Documentation & Negotiation',
                description: 'LOI exchange, POP verification, contract negotiation, and legal review with our compliance team oversight.',
              },
              {
                step: '05',
                title: 'Transaction Execution',
                description: 'Coordinate payment instruments, logistics, inspection, and delivery with full documentation trail.',
              },
              {
                step: '06',
                title: 'Post-Transaction Support',
                description: 'Ongoing relationship management, dispute resolution assistance, and preparation for future transactions.',
              },
            ].map((phase, index) => (
              <div
                key={index}
                className="flex items-start gap-6 bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="shrink-0 w-16 h-16 bg-linear-to-br from-blue-700 to-navy-950 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {phase.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 gradient-navy grid-pattern">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-text-light-primary mb-6">
            Ready to Start a Transaction?
          </h2>
          <p className="text-xl text-text-light-secondary mb-8">
            Submit an inquiry with your volume requirements and category. Our team responds within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              Submit Partnership Inquiry
            </a>
            <a
              href="/compliance"
              className="inline-block px-8 py-4 border-2 border-text-light-primary text-text-light-primary font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              View Our Credentials
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
