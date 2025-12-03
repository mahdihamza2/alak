import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getSiteSettings } from '@/lib/supabase/server';
import HomeHero from '@/components/sections/HomeHero';
import ValuePropsSection from '@/components/sections/ValuePropsSection';

export default async function Home() {
  // Fetch site settings
  const settings = await getSiteSettings();
  
  // Extract settings with defaults
  const rcNumber = settings.rc_number || '8867061';
  const tinNumber = settings.tin_number || '33567270-0001';
  const foundedYear = settings.company_founded_year || '2018';
  const headOfficeCity = settings.head_office_city || 'Abuja';
  const commercialOfficeCity = settings.commercial_office_city || 'Lagos';
  
  return (
    <>
      <Header settings={settings} />
      <main>
        {/* Hero Section with Clean Slideshow */}
        <HomeHero 
          rcNumber={rcNumber}
          tinNumber={tinNumber}
          foundedYear={foundedYear}
          headOfficeCity={headOfficeCity}
          commercialOfficeCity={commercialOfficeCity}
        />
        
        {/* Value Propositions Section */}
        <ValuePropsSection />

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
                highlight: `RC: ${rcNumber}`
              },
              {
                title: "Executive Leadership",
                desc: "Kabiru Jibril (ECO) and Aliyu Ahmad Sunusi (MD) with proven track records.",
                highlight: "Verified Profiles"
              },
              {
                title: "Dual Office Presence",
                desc: `Head office in ${headOfficeCity} and commercial office in ${commercialOfficeCity} with Google Maps verification.`,
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
      <Footer settings={settings} />
    </>
  );
}
