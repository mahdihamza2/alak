import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getSiteSettings } from '@/lib/supabase/server';

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch site settings for header and footer
  const settings = await getSiteSettings();
  
  return (
    <>
      <Header settings={settings} />
      <main>
        {children}
      </main>
      <Footer settings={settings} />
    </>
  );
}
