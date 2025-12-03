'use client'

import { useEffect, useState } from 'react'
import { db, ScheduledJob, JobStatusDashboard, JobExecutionLog, ApiConfig } from '@/lib/supabase/client'
import { PageHeader } from '@/components/cms'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { 
  RefreshCw,
  Clock,
  Play,
  Pause,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Activity,
  Database,
  Zap,
  ChevronRight,
  BarChart3,
  Eye,
  History,
  Key,
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils/helpers'

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobStatusDashboard[]>([])
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>([])
  const [logs, setLogs] = useState<JobExecutionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'jobs' | 'apis' | 'logs'>('jobs')
  const [selectedJob, setSelectedJob] = useState<JobStatusDashboard | null>(null)
  const [jobLogs, setJobLogs] = useState<JobExecutionLog[]>([])
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const [jobsData, apisData, logsData] = await Promise.all([
        db.scheduledJobs.getDashboard(),
        db.apiConfigs.getAll(),
        db.jobExecutionLogs.getAll({ limit: 50 }),
      ])

      setJobs(jobsData)
      setApiConfigs(apisData)
      setLogs(logsData.data || [])
    } catch (error) {
      console.error('Error fetching jobs data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const toggleJobActive = async (id: string, currentStatus: boolean | null) => {
    setProcessing(id)
    try {
      const allJobs = await db.scheduledJobs.getAll()
      const job = allJobs.find(j => j.id === id)
      if (job) {
        await db.scheduledJobs.toggleActive(id, !currentStatus)
        fetchData(true)
      }
    } catch (error) {
      console.error('Error toggling job:', error)
    } finally {
      setProcessing(null)
    }
  }

  const toggleApiActive = async (id: string, currentStatus: boolean | null) => {
    setProcessing(id)
    try {
      await db.apiConfigs.toggleActive(id, !currentStatus)
      fetchData(true)
    } catch (error) {
      console.error('Error toggling API:', error)
    } finally {
      setProcessing(null)
    }
  }

  const openJobDetail = async (job: JobStatusDashboard) => {
    setSelectedJob(job)
    try {
      if (job.id) {
        const logsResult = await db.jobExecutionLogs.getRecentByJob(job.id, 20)
        setJobLogs(logsResult)
      }
    } catch (error) {
      console.error('Error fetching job logs:', error)
    }
    setIsDetailModalOpen(true)
  }

  const getStatusBadge = (status: string | null) => {
    const config: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'error' }> = {
      running: { label: 'Running', variant: 'info' },
      success: { label: 'Success', variant: 'success' },
      failed: { label: 'Failed', variant: 'error' },
      pending: { label: 'Pending', variant: 'warning' },
      idle: { label: 'Idle', variant: 'default' },
    }
    const c = config[status || 'idle'] || { label: status || 'Unknown', variant: 'default' as const }
    return <Badge variant={c.variant}>{c.label}</Badge>
  }

  const getJobTypeIcon = (type: string | null) => {
    switch (type) {
      case 'fetch_oil_prices':
        return <Database size={18} className="text-amber-600" />
      case 'fetch_news':
        return <Activity size={18} className="text-blue-600" />
      case 'auto_post':
        return <Zap size={18} className="text-green-600" />
      default:
        return <Clock size={18} className="text-neutral-600" />
    }
  }

  const formatDuration = (ms: number | null) => {
    if (!ms) return '-'
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Loading scheduled jobs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Scheduled Jobs"
        description="Monitor and manage automated API fetching and content generation"
        actions={
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchData(true)}
              disabled={refreshing}
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </>
        }
      />

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden mb-6">
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'jobs'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <Clock size={16} />
            Scheduled Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('apis')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'apis'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <Key size={16} />
            API Configs ({apiConfigs.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <History size={16} />
            Execution Logs ({logs.length})
          </button>
        </div>
      </div>

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {jobs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No scheduled jobs</h3>
              <p className="text-neutral-500">Scheduled jobs will appear here once configured.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {jobs.map((job) => (
                <div 
                  key={job.id}
                  className="p-6 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-neutral-100 rounded-xl">
                        {getJobTypeIcon(job.job_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-neutral-900">{job.job_name}</h3>
                          {getStatusBadge(job.current_status)}
                          {!job.is_active && (
                            <Badge variant="warning">Paused</Badge>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500 mb-2">{job.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-neutral-600">
                            <Clock size={14} />
                            <span>Every {job.interval_hours}h</span>
                          </div>
                          {job.last_run_at && (
                            <div className="flex items-center gap-1.5 text-neutral-600">
                              <Calendar size={14} />
                              <span>Last: {formatDateTime(job.last_run_at)}</span>
                            </div>
                          )}
                          {job.next_run_at && (
                            <div className="flex items-center gap-1.5 text-primary-600">
                              <Zap size={14} />
                              <span>Next: {formatDateTime(job.next_run_at)}</span>
                            </div>
                          )}
                        </div>

                        {job.last_error && (
                          <div className="mt-2 p-2 bg-red-50 rounded-lg flex items-start gap-2">
                            <AlertCircle size={14} className="text-red-600 mt-0.5 shrink-0" />
                            <p className="text-xs text-red-700 line-clamp-2">{job.last_error}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Stats */}
                      <div className="text-right hidden lg:block">
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <p className="text-neutral-500">Success Rate</p>
                            <p className="font-semibold text-neutral-900">
                              {job.success_rate ? `${job.success_rate.toFixed(0)}%` : '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-neutral-500">Total Runs</p>
                            <p className="font-semibold text-neutral-900">{job.total_runs || 0}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleJobActive(job.id!, job.is_active)}
                          disabled={processing === job.id}
                          className={`p-2 rounded-lg transition-colors ${
                            job.is_active
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={job.is_active ? 'Pause Job' : 'Resume Job'}
                        >
                          {job.is_active ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        <button
                          onClick={() => openJobDetail(job)}
                          className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* API Configs Tab */}
      {activeTab === 'apis' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {apiConfigs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Key size={32} className="text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No API configurations</h3>
              <p className="text-neutral-500">Configure your API keys in the settings.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {apiConfigs.map((api) => (
                <div 
                  key={api.id}
                  className="p-6 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-neutral-900">{api.api_name}</h3>
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs">
                          {api.api_provider}
                        </span>
                        {!api.is_active && (
                          <Badge variant="warning">Disabled</Badge>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 mb-2">{api.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-neutral-600">
                          <Clock size={14} />
                          <span>Every {api.fetch_interval_hours}h</span>
                        </div>
                        {api.last_fetch_at && (
                          <div className="flex items-center gap-1.5 text-neutral-600">
                            <Calendar size={14} />
                            <span>Last Fetch: {formatDateTime(api.last_fetch_at)}</span>
                          </div>
                        )}
                        {api.next_fetch_at && (
                          <div className="flex items-center gap-1.5 text-primary-600">
                            <Zap size={14} />
                            <span>Next: {formatDateTime(api.next_fetch_at)}</span>
                          </div>
                        )}
                      </div>

                      {api.last_error && (
                        <div className="mt-2 p-2 bg-red-50 rounded-lg flex items-start gap-2">
                          <AlertCircle size={14} className="text-red-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-red-700">{api.last_error}</p>
                            <p className="text-xs text-red-500 mt-0.5">
                              Consecutive failures: {api.consecutive_failures}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Rate Limits */}
                      <div className="text-right hidden lg:block">
                        <p className="text-xs text-neutral-500 mb-1">Rate Limits</p>
                        <div className="text-sm">
                          <span className="text-neutral-600">{api.current_day_calls || 0}</span>
                          <span className="text-neutral-400">/{api.rate_limit_per_day || '∞'}</span>
                          <span className="text-neutral-400 ml-1">daily</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <button
                        onClick={() => toggleApiActive(api.id, api.is_active)}
                        disabled={processing === api.id}
                        className={`p-2 rounded-lg transition-colors ${
                          api.is_active
                            ? 'text-amber-600 hover:bg-amber-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={api.is_active ? 'Disable API' : 'Enable API'}
                      >
                        {api.is_active ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Execution Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {logs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <History size={32} className="text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No execution logs</h3>
              <p className="text-neutral-500">Job execution history will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Started
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Records
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Triggered By
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-neutral-900">{log.job_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {log.status === 'success' ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : log.status === 'failed' ? (
                            <XCircle size={16} className="text-red-600" />
                          ) : (
                            <RefreshCw size={16} className="text-blue-600 animate-spin" />
                          )}
                          <span className={`text-sm font-medium ${
                            log.status === 'success' ? 'text-green-600' :
                            log.status === 'failed' ? 'text-red-600' :
                            'text-blue-600'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                        {log.error_message && (
                          <p className="text-xs text-red-500 mt-1 truncate max-w-[200px]">
                            {log.error_message}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600">
                          {formatDateTime(log.started_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600">
                          {formatDuration(log.duration_ms)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {log.records_processed ? (
                            <span className="text-neutral-900">
                              {log.records_processed} processed
                              {log.records_created ? `, ${log.records_created} created` : ''}
                              {log.records_failed ? <span className="text-red-500">, {log.records_failed} failed</span> : ''}
                            </span>
                          ) : (
                            <span className="text-neutral-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs">
                          {log.triggered_by || 'scheduled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Job Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Job Details"
        size="lg"
      >
        {selectedJob && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-neutral-100 rounded-xl">
                {getJobTypeIcon(selectedJob.job_type)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900">{selectedJob.job_name}</h3>
                <p className="text-neutral-500">{selectedJob.description}</p>
              </div>
              {getStatusBadge(selectedJob.current_status)}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-neutral-900">{selectedJob.total_runs || 0}</p>
                <p className="text-sm text-neutral-500">Total Runs</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{selectedJob.successful_runs || 0}</p>
                <p className="text-sm text-neutral-500">Successful</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{selectedJob.failed_runs || 0}</p>
                <p className="text-sm text-neutral-500">Failed</p>
              </div>
              <div className="bg-primary-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary-600">
                  {selectedJob.success_rate ? `${selectedJob.success_rate.toFixed(0)}%` : '-'}
                </p>
                <p className="text-sm text-neutral-500">Success Rate</p>
              </div>
            </div>

            {/* Schedule Info */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <h4 className="font-medium text-neutral-900 mb-3 flex items-center gap-2">
                <Clock size={16} />
                Schedule
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-500">Interval</p>
                  <p className="font-medium text-neutral-900">Every {selectedJob.interval_hours} hours</p>
                </div>
                <div>
                  <p className="text-neutral-500">Status</p>
                  <p className="font-medium text-neutral-900">
                    {selectedJob.is_active ? 'Active' : 'Paused'}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500">Last Run</p>
                  <p className="font-medium text-neutral-900">
                    {selectedJob.last_run_at ? formatDateTime(selectedJob.last_run_at) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500">Next Run</p>
                  <p className="font-medium text-neutral-900">
                    {selectedJob.next_run_at ? formatDateTime(selectedJob.next_run_at) : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Executions */}
            <div>
              <h4 className="font-medium text-neutral-900 mb-3 flex items-center gap-2">
                <History size={16} />
                Recent Executions
              </h4>
              {jobLogs.length === 0 ? (
                <p className="text-neutral-500 text-sm">No execution history available</p>
              ) : (
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-neutral-50">
                        <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-500">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-500">Started</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-500">Duration</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-500">Records</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {jobLogs.slice(0, 10).map((log) => (
                        <tr key={log.id}>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-1.5">
                              {log.status === 'success' ? (
                                <CheckCircle size={14} className="text-green-600" />
                              ) : (
                                <XCircle size={14} className="text-red-600" />
                              )}
                              <span className="text-sm">{log.status}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm text-neutral-600">
                            {formatDateTime(log.started_at)}
                          </td>
                          <td className="px-4 py-2 text-sm text-neutral-600">
                            {formatDuration(log.duration_ms)}
                          </td>
                          <td className="px-4 py-2 text-sm text-neutral-600">
                            {log.records_processed || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
