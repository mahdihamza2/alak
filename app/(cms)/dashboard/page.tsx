'use client';

import { useEffect, useState } from 'react';
import { db, Inquiry } from '@/lib/supabase/client';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Droplet,
  Fuel,
  Plane,
  Calendar,
  Mail,
  Phone,
  Building2,
} from 'lucide-react';
import { formatDateTime, getCategoryLabel, getProductLabel, getStatusColor } from '@/lib/utils/helpers';

export default function DashboardPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    qualified: 0,
    contacted: 0,
  });

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const data = await db.inquiries.getAll();
      setInquiries(data);

      // Calculate stats
      setStats({
        total: data.length,
        pending: data.filter(i => i.status === 'pending').length,
        qualified: data.filter(i => i.status === 'qualified').length,
        contacted: data.filter(i => i.status === 'contacted').length,
      });
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductIcon = (product: string) => {
    switch (product) {
      case 'crude-oil':
        return <Droplet size={16} />;
      case 'pms':
      case 'ago':
        return <Fuel size={16} />;
      case 'jet-fuel':
        return <Plane size={16} />;
      default:
        return <Droplet size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600">
            Partnership inquiries and lead management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card hover padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Inquiries</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users size={24} className="text-blue-700" />
              </div>
            </div>
          </Card>

          <Card hover padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-warning">{stats.pending}</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <Clock size={24} className="text-warning" />
              </div>
            </div>
          </Card>

          <Card hover padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Contacted</p>
                <p className="text-3xl font-bold text-blue-700">{stats.contacted}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp size={24} className="text-blue-700" />
              </div>
            </div>
          </Card>

          <Card hover padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Qualified</p>
                <p className="text-3xl font-bold text-success">{stats.qualified}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <CheckCircle size={24} className="text-success" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {inquiries.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-600">No inquiries yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {inquiry.full_name}
                          </h3>
                          <Badge className={getStatusColor(inquiry.status)}>
                            {inquiry.status}
                          </Badge>
                          <Badge variant="info">
                            {getCategoryLabel(inquiry.category)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Building2 size={14} />
                            {inquiry.company_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDateTime(inquiry.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Mail size={16} className="text-slate-400" />
                        <a href={`mailto:${inquiry.email}`} className="hover:text-blue-700">
                          {inquiry.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Phone size={16} className="text-slate-400" />
                        <a href={`tel:${inquiry.phone}`} className="hover:text-blue-700">
                          {inquiry.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        {getProductIcon(inquiry.product_type)}
                        <span className="font-medium text-slate-700">
                          {getProductLabel(inquiry.product_type)}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">
                        Volume: <span className="font-semibold text-slate-900">
                          {inquiry.estimated_volume} {inquiry.volume_unit}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {inquiry.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
