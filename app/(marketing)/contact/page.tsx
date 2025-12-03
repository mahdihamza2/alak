'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Contact Info
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    
    // Step 2: Category & Requirements
    category: '',
    productType: '',
    estimatedVolume: '',
    volumeUnit: 'BBLs',
    
    // Step 3: Message
    message: '',
    agreedToTerms: false,
  });
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const offices = [
    {
      name: 'Head Office - Abuja',
      type: 'Executive & Operations',
      address: 'Gwarimpa Estate, Abuja FCT, Nigeria',
      phone: '+234 803 XXX XXXX',
      email: 'abuja@alakoilandgas.com',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM WAT',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.9876543210123!2d7.123456!3d9.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDcnMjQuNCJOIDfCsDA3JzI0LjQiRQ!5e0!3m2!1sen!2sng!4v1234567890123!5m2!1sen!2sng',
    },
    {
      name: 'Commercial Office - Lagos',
      type: 'Sales & Client Relations',
      address: 'Lekki Phase 1, Lagos State, Nigeria',
      phone: '+234 805 XXX XXXX',
      email: 'lagos@alakoilandgas.com',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM WAT',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.1234567890123!2d3.123456!3d6.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDcnMjQuNCJOIDPCsDA3JzI0LjQiRQ!5e0!3m2!1sen!2sng!4v1234567890123!5m2!1sen!2sng',
    },
  ];

  const categories = [
    { value: 'verified-buyer', label: 'Verified Buyer', description: 'Looking to purchase products' },
    { value: 'verified-seller', label: 'Verified Seller', description: 'Have products to offer' },
    { value: 'strategic-partner', label: 'Strategic Partner', description: 'Joint ventures or collaborations' },
  ];

  const productTypes = [
    { value: 'crude-oil', label: 'Crude Oil' },
    { value: 'pms', label: 'PMS (Gasoline)' },
    { value: 'ago', label: 'AGO (Diesel)' },
    { value: 'jet-fuel', label: 'Jet Fuel (ATK)' },
    { value: 'multiple', label: 'Multiple Products' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.email && formData.phone && formData.companyName);
      case 2:
        return !!(formData.category && formData.productType && formData.estimatedVolume);
      case 3:
        return !!(formData.message && formData.agreedToTerms);
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setFormStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      setErrorMessage('Please complete all required fields');
      return;
    }

    setSubmitStatus('submitting');
    setErrorMessage('');

    try {
      // TODO: Replace with actual Supabase submission
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submission failed');

      setSubmitStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        category: '',
        productType: '',
        estimatedVolume: '',
        volumeUnit: 'BBLs',
        message: '',
        agreedToTerms: false,
      });
      setFormStep(1);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Failed to submit inquiry. Please try again or contact us directly.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('/images/refinery_image (4).jpg')" }}
        />
        {/* Gradient Overlay for professional look */}
        <div className="absolute inset-0 bg-linear-to-b from-navy-950/70 via-navy-950/60 to-navy-950/80" />
        <div className="absolute inset-0 bg-linear-to-r from-navy-950/40 to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Mail size={48} className="text-gold-500 drop-shadow-lg" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in drop-shadow-lg">
            Get in <span className="text-gold-500">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Submit a partnership inquiry or reach out to our offices directly. We respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Form & Offices */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Multi-Step Form */}
            <div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Partnership Inquiry
                </h2>

                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                          formStep >= step
                            ? 'bg-blue-700 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div
                          className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                            formStep > step ? 'bg-blue-700' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Step 1: Contact Info */}
                  {formStep === 1 && (
                    <div className="space-y-4 animate-fade-in">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Contact Information
                      </h3>
                      
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Category & Requirements */}
                  {formStep === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Category & Requirements
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                          Category *
                        </label>
                        <div className="space-y-3">
                          {categories.map((cat) => (
                            <label
                              key={cat.value}
                              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                                formData.category === cat.value
                                  ? 'border-blue-700 bg-blue-50'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name="category"
                                value={cat.value}
                                checked={formData.category === cat.value}
                                onChange={handleInputChange}
                                className="mt-1"
                              />
                              <div>
                                <div className="font-semibold text-slate-900">{cat.label}</div>
                                <div className="text-sm text-slate-600">{cat.description}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="productType" className="block text-sm font-medium text-slate-700 mb-2">
                          Product Type *
                        </label>
                        <select
                          id="productType"
                          name="productType"
                          value={formData.productType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                        >
                          <option value="">Select product...</option>
                          {productTypes.map((product) => (
                            <option key={product.value} value={product.value}>
                              {product.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="estimatedVolume" className="block text-sm font-medium text-slate-700 mb-2">
                          Estimated Volume *
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            id="estimatedVolume"
                            name="estimatedVolume"
                            value={formData.estimatedVolume}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g., 500,000"
                            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                          />
                          <select
                            name="volumeUnit"
                            value={formData.volumeUnit}
                            onChange={handleInputChange}
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                          >
                            <option value="BBLs">BBLs</option>
                            <option value="MT">MT</option>
                            <option value="Liters">Liters</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Message */}
                  {formStep === 3 && (
                    <div className="space-y-4 animate-fade-in">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Additional Information
                      </h3>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          placeholder="Provide additional details about your inquiry, timeline, or specific requirements..."
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent resize-none"
                        />
                      </div>

                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="agreedToTerms"
                          name="agreedToTerms"
                          checked={formData.agreedToTerms}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                        <label htmlFor="agreedToTerms" className="text-sm text-slate-700">
                          I agree to Alak Oil and Gas conducting due diligence as part of our KYC/AML compliance process *
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="flex items-center gap-2 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm mt-4">
                      <AlertCircle size={16} />
                      {errorMessage}
                    </div>
                  )}

                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <div className="flex items-center gap-2 p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm mt-4">
                      <CheckCircle size={16} />
                      Inquiry submitted successfully! We'll contact you within 24 hours.
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8">
                    {formStep > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all duration-300"
                      >
                        Previous
                      </button>
                    ) : (
                      <div />
                    )}

                    {formStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!validateStep(formStep)}
                        className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                          validateStep(formStep)
                            ? 'bg-blue-700 hover:bg-gold-600 text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Next Step
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitStatus === 'submitting' || !validateStep(3)}
                        className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                          submitStatus === 'submitting' || !validateStep(3)
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-gold-500 hover:bg-gold-600 text-navy-950'
                        }`}
                      >
                        {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Office Locations */}
            <div className="space-y-8">
              {offices.map((office, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  {/* Map Embed */}
                  <div className="h-64 bg-slate-100">
                    <iframe
                      src={office.mapEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map of ${office.name}`}
                    />
                  </div>

                  {/* Office Details */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">
                      {office.name}
                    </h3>
                    <p className="text-sm text-blue-700 font-semibold mb-4">
                      {office.type}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-slate-500 shrink-0 mt-1" />
                        <span className="text-slate-700">{office.address}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone size={20} className="text-slate-500 shrink-0" />
                        <a href={`tel:${office.phone}`} className="text-blue-700 hover:text-gold-600 transition-colors">
                          {office.phone}
                        </a>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail size={20} className="text-slate-500 shrink-0" />
                        <a href={`mailto:${office.email}`} className="text-blue-700 hover:text-gold-600 transition-colors">
                          {office.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock size={20} className="text-slate-500 shrink-0" />
                        <span className="text-slate-700">{office.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Contact Methods */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Other Ways to Reach Us
          </h2>
          <p className="text-lg text-slate-700 mb-12">
            Choose the communication method that works best for you
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <Phone size={32} className="text-blue-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Phone Support
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Direct line to our team
              </p>
              <a href="tel:+234803XXXXXXX" className="text-blue-700 hover:text-gold-600 font-semibold transition-colors">
                +234 803 XXX XXXX
              </a>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <Mail size={32} className="text-blue-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Email Support
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                General inquiries
              </p>
              <a href="mailto:info@alakoilandgas.com" className="text-blue-700 hover:text-gold-600 font-semibold transition-colors">
                info@alakoilandgas.com
              </a>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <Clock size={32} className="text-blue-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Response Time
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                We respond quickly
              </p>
              <span className="text-success font-semibold">
                Within 24 Hours
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
