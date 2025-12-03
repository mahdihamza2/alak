import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-neutral-200',
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-neutral-100">
      <td className="px-4 py-4">
        <Skeleton className="h-5 w-32" />
      </td>
      <td className="px-4 py-4">
        <Skeleton className="h-5 w-40" />
      </td>
      <td className="px-4 py-4">
        <Skeleton className="h-5 w-24" />
      </td>
      <td className="px-4 py-4">
        <Skeleton className="h-6 w-20 rounded-full" />
      </td>
      <td className="px-4 py-4">
        <Skeleton className="h-5 w-28" />
      </td>
    </tr>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-100">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                {['Name', 'Company', 'Category', 'Status', 'Date'].map((header) => (
                  <th key={header} className="px-4 py-3 text-left">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ))}
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  )
}
