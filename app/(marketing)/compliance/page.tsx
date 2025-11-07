'use client';

import { Metadata } from 'next';
import { Shield, FileCheck, Download, CheckCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function CompliancePage() {
  const [copiedRC, setCopiedRC] = useState(false);
  const [copiedTIN, setCopiedTIN] = useState(false);

  const copyToClipboard = (text: string, type: 'RC' | 'TIN') => {
    navigator.clipboard.writeText(text);
    if (type === 'RC') {
      setCopiedRC(true);
      setTimeout(() => setCopiedRC(false), 2000);
    } else {
      setCopiedTIN(true);
      setTimeout(() => setCopiedTIN(false), 2000);
    }
  };

  const documents = [
    {
      title: 'Certificate of Incorporation',
      description: 'Official CAC registration certificate',
      file: '/docs/certificate-of-incorporation.pdf',
      size: '245 KB',
      verified: true,
    },
    {
      title: 'Tax Identification Certificate',
      description: 'FIRS tax registration documentation',
      file: '/docs/tin-certificate.pdf',
      size: '189 KB',
      verified: true,
    },
    {
      title: 'Anti-Corruption Policy',
      description: 'Our commitment to ethical business practices',
      file: '/docs/anti-corruption-policy.pdf',
      size: '312 KB',
      verified: true,
    },
    {
      title: 'KYC/AML Compliance Statement',
      description: 'Know Your Customer and Anti-Money Laundering policies',
      file: '/docs/kyc-aml-statement.pdf',
      size: '276 KB',
      verified: true,
    },
  ];

  const complianceAreas = [
    {
      title: 'Corporate Affairs Commission (CAC)',
      description: 'Fully registered and compliant with Nigerian corporate regulations',
      status: 'Verified',
    },
    {
      title: 'Federal Inland Revenue Service (FIRS)',
      description: 'Tax registration and ongoing compliance maintained',
      status: 'Verified',
    },
    {
      title: 'Industry Standards',
      description: 'Adherence to international energy trading best practices',
      status: 'Active',
    },
    {
      title: 'Data Protection',
      description: 'NDPR and international data privacy standards compliance',
      status: 'Active',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-navy grid-pattern relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield size={48} className="text-gold-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-text-light-primary mb-6 animate-fade-in">
            Compliance & <span className="text-gold-500">Credentials</span>
          </h1>
          <p className="text-xl text-text-light-secondary max-w-3xl mx-auto leading-relaxed">
            Full regulatory transparency. Downloadable documentation. Verified credentials you can trust.
          </p>
        </div>
      </section>

      {/* Regulatory Credentials Display */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Official Registration Details
            </h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              Unlike most competitors, we display our full regulatory credentials publicly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* RC Number */}
            <div className="bg-slate-50 border-2 border-blue-700 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck size={24} className="text-blue-700" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Registration Number (RC)
                </h3>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
                <div className="font-mono text-3xl font-bold text-navy-950 mb-2">
                  8867061
                </div>
                <div className="text-sm text-slate-600">
                  Corporate Affairs Commission of Nigeria
                </div>
              </div>
              <button
                onClick={() => copyToClipboard('8867061', 'RC')}
                className="flex items-center gap-2 text-blue-700 font-semibold hover:text-gold-600 transition-colors"
              >
                {copiedRC ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy RC Number
                  </>
                )}
              </button>
            </div>

            {/* TIN */}
            <div className="bg-slate-50 border-2 border-success rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck size={24} className="text-success" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Tax Identification Number (TIN)
                </h3>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
                <div className="font-mono text-3xl font-bold text-navy-950 mb-2">
                  33567270-0001
                </div>
                <div className="text-sm text-slate-600">
                  Federal Inland Revenue Service
                </div>
              </div>
              <button
                onClick={() => copyToClipboard('33567270-0001', 'TIN')}
                className="flex items-center gap-2 text-success font-semibold hover:text-gold-600 transition-colors"
              >
                {copiedTIN ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy TIN
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="max-w-4xl mx-auto mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <CheckCircle size={24} className="text-blue-700 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Independent Verification Available
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed">
                  You can independently verify our registration with the Corporate Affairs Commission (CAC) 
                  using our RC number 8867061, and our tax status with the Federal Inland Revenue Service (FIRS) 
                  using our TIN 33567270-0001. We encourage all potential partners to perform due diligence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Downloadable Documents */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Compliance Documentation
            </h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              Download our official certificates and policy documents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {doc.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">{doc.size}</span>
                      {doc.verified && (
                        <span className="flex items-center gap-1 text-success font-medium">
                          <CheckCircle size={14} />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <a
                  href={doc.file}
                  download
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-700 hover:bg-gold-600 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  <Download size={16} />
                  Download PDF
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Areas */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Areas of Compliance
            </h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              Our commitment to regulatory excellence across all operational areas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceAreas.map((area, index) => (
              <div
                key={index}
                className="bg-slate-50 border border-slate-200 rounded-xl p-8"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-slate-900 flex-1">
                    {area.title}
                  </h3>
                  <span className="px-3 py-1 bg-success/10 text-success text-sm font-semibold rounded-full">
                    {area.status}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 gradient-navy grid-pattern">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-text-light-primary mb-6">
            Questions About Our Credentials?
          </h2>
          <p className="text-xl text-text-light-secondary mb-8">
            Our team is available to provide additional documentation or answer any compliance-related inquiries.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            Contact Compliance Team
          </a>
        </div>
      </section>
    </div>
  );
}
