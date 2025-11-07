import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatVolume(volume: string, unit: string): string {
  return `${volume} ${unit}`;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'verified-buyer': 'Verified Buyer',
    'verified-seller': 'Verified Seller',
    'strategic-partner': 'Strategic Partner',
  };
  return labels[category] || category;
}

export function getProductLabel(product: string): string {
  const labels: Record<string, string> = {
    'crude-oil': 'Crude Oil',
    'pms': 'PMS (Gasoline)',
    'ago': 'AGO (Diesel)',
    'jet-fuel': 'Jet Fuel (ATK)',
    'multiple': 'Multiple Products',
  };
  return labels[product] || product;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'pending': 'Pending Review',
    'reviewing': 'Under Review',
    'contacted': 'Contacted',
    'qualified': 'Qualified',
    'rejected': 'Rejected',
    'closed': 'Closed',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'pending': 'bg-warning/10 text-warning',
    'reviewing': 'bg-blue-500/10 text-blue-700',
    'contacted': 'bg-blue-600/10 text-blue-800',
    'qualified': 'bg-success/10 text-success',
    'rejected': 'bg-error/10 text-error',
    'closed': 'bg-slate-200 text-slate-600',
  };
  return colors[status] || 'bg-slate-100 text-slate-600';
}
