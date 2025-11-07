import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Alak Oil and Gas CMS',
  description: 'Admin dashboard for managing inquiries and leads',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
