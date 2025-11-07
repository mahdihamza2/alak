import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="gradient-navy grid-pattern relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto text-center animate-fade-in">
          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 mb-8 text-sm font-mono text-text-light-secondary">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 bg-success rounded-full" />
              RC: 8867061
            </span>
            <span className="text-text-light-tertiary">|</span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 bg-success rounded-full" />
              TIN: 33567270-0001
            </span>
            <span className="text-text-light-tertiary">|</span>
            <span>Est. 2018</span>
            <span className="text-text-light-tertiary">|</span>
            <span>Abuja & Lagos</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-text-light-primary mb-6 leading-tight">
            Your Verified Gateway to <br />
            <span className="text-gold-500">Global Energy Transactions</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-text-light-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
            Nigeria's most transparent energy intermediary. Full regulatory disclosure, 
            verified credentials, and intelligent buyer-seller matching for crude oil and refined products.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="group px-8 py-4 bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,183,77,0.5)] hover:-translate-y-1">
              Verify Our Credentials
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button className="px-8 py-4 border-2 border-text-light-primary text-text-light-primary font-semibold rounded-lg hover:bg-white/10 transition-all duration-300">
              Begin Partnership Inquiry
            </button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20 text-left">
            {[
              { title: "Transparency First", desc: "RC/TIN prominently displayed" },
              { title: "Verified Network", desc: "Categorized buyer-seller system" },
              { title: "Local Expertise", desc: "Dual Nigerian presence" },
              { title: "Risk Reduction", desc: "Compliance-focused operations" }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-gold-500 font-semibold mb-2">{item.title}</h3>
                <p className="text-text-light-secondary text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Built on Trust, Powered by Technology
            </h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              While others promise, we prove. See the difference transparency makes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Regulatory Compliance",
                desc: "Full CAC registration, verified TIN, and downloadable documentation.",
                highlight: "RC: 8867061"
              },
              {
                title: "Executive Leadership",
                desc: "Kabiru Jibril (ECO) and Aliyu Ahmad Sunusi (MD) with proven track records.",
                highlight: "Verified Profiles"
              },
              {
                title: "Dual Office Presence",
                desc: "Head office in Abuja and commercial office in Lagos with Google Maps verification.",
                highlight: "Physical Locations"
              }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="text-blue-700 font-mono text-sm font-semibold mb-3">{item.highlight}</div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
