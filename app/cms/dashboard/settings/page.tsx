'use client'

import { useEffect, useState, useCallback } from 'react'
import { db } from '@/lib/supabase/client'
import { SiteSetting, Json } from '@/lib/supabase/database.types'
import { PageHeader } from '@/components/cms'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { Tabs } from '@/components/ui/Tabs'
import { 
  Settings,
  Globe,
  Mail,
  Shield,
  Bell,
  Palette,
  Save,
  RefreshCw,
  Building2,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Key,
  Clock,
  Lock,
  Users,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'

type SettingsState = Record<string, string>

// Helper to convert Json value to string
const jsonToString = (value: Json): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return JSON.stringify(value)
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({})
  const [originalSettings, setOriginalSettings] = useState<SettingsState>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('site')
  const [savedMessage, setSavedMessage] = useState('')
  const [showSmtpPassword, setShowSmtpPassword] = useState(false)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const data = await db.settings.getAll()
      const settingsMap: SettingsState = {}
      data?.forEach((s: SiteSetting) => {
        settingsMap[s.key] = jsonToString(s.value)
      })
      setSettings(settingsMap)
      setOriginalSettings(settingsMap)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleToggle = (key: string) => {
    setSettings(prev => ({ 
      ...prev, 
      [key]: prev[key] === 'true' ? 'false' : 'true' 
    }))
  }

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings)

  const [errorMessage, setErrorMessage] = useState('')

  // Determine if a setting should be public (visible on the public website)
  const isPublicSetting = (key: string): boolean => {
    // Public settings - visible on frontend
    const publicKeys = [
      'company_name', 'company_tagline', 'company_description', 'company_email', 'company_founded_year',
      'rc_number', 'tin_number',
      'head_office_city', 'head_office_address', 'head_office_phone',
      'commercial_office_city', 'commercial_office_address', 'commercial_office_email',
      'social_facebook', 'social_twitter', 'social_linkedin', 'social_instagram',
      'show_social_links', 'show_compliance_bar', 'show_rc_number', 'show_tin_number'
    ]
    return publicKeys.includes(key)
  }

  const handleSave = async () => {
    setSaving(true)
    setErrorMessage('')
    try {
      const changedSettings = Object.entries(settings).filter(
        ([key, value]) => value !== originalSettings[key]
      )
      
      // Save settings sequentially to avoid race conditions
      for (const [key, value] of changedSettings) {
        await db.settings.upsert({ 
          key, 
          value: value, // Value will be stored as JSON string
          label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          category: getCategory(key),
          is_public: isPublicSetting(key)
        })
      }
      
      setOriginalSettings(settings)
      setSavedMessage('Settings saved successfully!')
      setTimeout(() => setSavedMessage(''), 3000)
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save settings'
      console.error('Error saving settings:', error)
      setErrorMessage(errorMsg)
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setSaving(false)
    }
  }

  // Map setting keys to valid database category enum values
  // Valid categories: general, seo, contact, social, branding, compliance, analytics, features
  const getCategory = (key: string): 'general' | 'seo' | 'contact' | 'social' | 'branding' | 'compliance' | 'analytics' | 'features' => {
    if (key.startsWith('site_') || key.startsWith('seo_')) return 'seo'
    if (key.startsWith('company_') || key.startsWith('head_office_') || key.startsWith('commercial_office_')) return 'contact'
    if (key.startsWith('social_') || key.startsWith('show_social_')) return 'social'
    if (key.startsWith('brand_') || key.startsWith('logo_')) return 'branding'
    if (key.startsWith('rc_') || key.startsWith('tin_') || key.startsWith('show_compliance_') || key.startsWith('show_rc_') || key.startsWith('show_tin_')) return 'compliance'
    if (key.startsWith('smtp_') || key.startsWith('email_') || key.startsWith('security_') || key.startsWith('notification_')) return 'features'
    if (key.startsWith('analytics_')) return 'analytics'
    return 'general'
  }

  const handleReset = () => {
    setSettings(originalSettings)
  }

  const tabs = [
    { id: 'site', label: 'Site Settings', icon: <Globe size={18} /> },
    { id: 'email', label: 'Email', icon: <Mail size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your dashboard and system preferences"
        breadcrumb={[
          { label: 'Dashboard', href: '/cms/dashboard' },
          { label: 'Settings' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            {errorMessage && (
              <span className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">
                <AlertCircle size={16} />
                {errorMessage}
              </span>
            )}
            {savedMessage && (
              <span className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-xl">
                <Check size={16} />
                {savedMessage}
              </span>
            )}
            <Button variant="outline" onClick={handleReset} disabled={!hasChanges || saving}>
              <RefreshCw size={18} />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || saving}>
              {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
              Save Changes
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
          className="px-6 pt-4 border-b border-neutral-200"
        />
        
        <div className="p-6">
          {/* Site Settings Tab */}
          {activeTab === 'site' && (
            <div className="space-y-8">
              {/* Company Information */}
              <section>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Building2 size={20} className="text-primary-600" />
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Company Name"
                    value={settings.company_name || ''}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    placeholder="Alak Oil and Gas"
                  />
                  <Input
                    label="Company Tagline"
                    value={settings.company_tagline || ''}
                    onChange={(e) => handleChange('company_tagline', e.target.value)}
                    placeholder="Your Verified Gateway to Global Energy"
                  />
                  <Input
                    label="Founded Year"
                    value={settings.company_founded_year || ''}
                    onChange={(e) => handleChange('company_founded_year', e.target.value)}
                    placeholder="2018"
                  />
                  <Input
                    label="Company Email"
                    value={settings.company_email || ''}
                    onChange={(e) => handleChange('company_email', e.target.value)}
                    placeholder="info@alakoilandgas.com"
                    type="email"
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Company Description
                    </label>
                    <Textarea
                      value={settings.company_description || ''}
                      onChange={(e) => handleChange('company_description', e.target.value)}
                      placeholder="Brief description of your company for the public site..."
                      rows={3}
                    />
                  </div>
                </div>
              </section>

              {/* Registration / Compliance */}
              <section>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-primary-600" />
                  Registration & Compliance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="RC Number"
                    value={settings.rc_number || ''}
                    onChange={(e) => handleChange('rc_number', e.target.value)}
                    placeholder="8867061"
                  />
                  <Input
                    label="TIN Number"
                    value={settings.tin_number || ''}
                    onChange={(e) => handleChange('tin_number', e.target.value)}
                    placeholder="33567270-0001"
                  />
                </div>
                {/* Compliance Visibility Toggles */}
                <div className="mt-6 space-y-4">
                  <p className="text-sm text-neutral-500">Control visibility of compliance credentials on the public Compliance page</p>
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div>
                      <p className="font-medium text-neutral-900">Show RC Number</p>
                      <p className="text-sm text-neutral-500">Display the RC number on the public Compliance page</p>
                    </div>
                    <button
                      onClick={() => handleToggle('show_rc_number')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.show_rc_number !== 'false' ? 'bg-primary-600' : 'bg-neutral-300'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.show_rc_number !== 'false' ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div>
                      <p className="font-medium text-neutral-900">Show TIN Number</p>
                      <p className="text-sm text-neutral-500">Display the TIN number on the public Compliance page</p>
                    </div>
                    <button
                      onClick={() => handleToggle('show_tin_number')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.show_tin_number !== 'false' ? 'bg-primary-600' : 'bg-neutral-300'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.show_tin_number !== 'false' ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </section>

              {/* Head Office */}
              <section>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-primary-600" />
                  Head Office
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="City"
                    value={settings.head_office_city || ''}
                    onChange={(e) => handleChange('head_office_city', e.target.value)}
                    placeholder="Abuja, FCT"
                  />
                  <Input
                    label="Phone"
                    value={settings.head_office_phone || ''}
                    onChange={(e) => handleChange('head_office_phone', e.target.value)}
                    placeholder="+234 803 XXX XXXX"
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Address"
                      value={settings.head_office_address || ''}
                      onChange={(e) => handleChange('head_office_address', e.target.value)}
                      placeholder="Gwarimpa Estate, Opposite H Medix, Federal Capital Territory, Nigeria"
                    />
                  </div>
                </div>
              </section>

              {/* Commercial Office */}
              <section>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-primary-600" />
                  Commercial Office
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="City"
                    value={settings.commercial_office_city || ''}
                    onChange={(e) => handleChange('commercial_office_city', e.target.value)}
                    placeholder="Lagos"
                  />
                  <Input
                    label="Email"
                    value={settings.commercial_office_email || ''}
                    onChange={(e) => handleChange('commercial_office_email', e.target.value)}
                    placeholder="lagos@alakoilandgas.com"
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Address"
                      value={settings.commercial_office_address || ''}
                      onChange={(e) => handleChange('commercial_office_address', e.target.value)}
                      placeholder="No. 5 Lekki First Two, Lagos State, Nigeria"
                    />
                  </div>
                </div>
              </section>

              {/* Social Media */}
              <section>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Palette size={20} className="text-primary-600" />
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Facebook"
                    value={settings.social_facebook || ''}
                    onChange={(e) => handleChange('social_facebook', e.target.value)}
                    placeholder="https://facebook.com/company"
                  />
                  <Input
                    label="Twitter / X"
                    value={settings.social_twitter || ''}
                    onChange={(e) => handleChange('social_twitter', e.target.value)}
                    placeholder="https://twitter.com/company"
                  />
                  <Input
                    label="LinkedIn"
                    value={settings.social_linkedin || ''}
                    onChange={(e) => handleChange('social_linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/company"
                  />
                  <Input
                    label="Instagram"
                    value={settings.social_instagram || ''}
                    onChange={(e) => handleChange('social_instagram', e.target.value)}
                    placeholder="https://instagram.com/company"
                  />
                </div>
              </section>

              {/* Visibility Toggles */}
              <section>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Eye size={20} className="text-primary-600" />
                  Public Site Visibility
                </h3>
                <p className="text-sm text-neutral-500 mb-4">Control what sections are visible on the public website</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div>
                      <p className="font-medium text-neutral-900">Show Social Links</p>
                      <p className="text-sm text-neutral-500">Display social media icons in the footer</p>
                    </div>
                    <button
                      onClick={() => handleToggle('show_social_links')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.show_social_links !== 'false' ? 'bg-primary-600' : 'bg-neutral-300'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.show_social_links !== 'false' ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div>
                      <p className="font-medium text-neutral-900">Show Compliance Bar</p>
                      <p className="text-sm text-neutral-500">Display RC and TIN numbers in the footer compliance bar</p>
                    </div>
                    <button
                      onClick={() => handleToggle('show_compliance_bar')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.show_compliance_bar !== 'false' ? 'bg-primary-600' : 'bg-neutral-300'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.show_compliance_bar !== 'false' ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Email Settings Tab */}
          {activeTab === 'email' && (
            <div className="space-y-8">
              {/* SMTP Configuration */}
              <section>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Mail size={20} className="text-primary-600" />
                  SMTP Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="SMTP Host"
                    value={settings.smtp_host || ''}
                    onChange={(e) => handleChange('smtp_host', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                  <Input
                    label="SMTP Port"
                    value={settings.smtp_port || ''}
                    onChange={(e) => handleChange('smtp_port', e.target.value)}
                    placeholder="587"
                    type="number"
                  />
                  <Input
                    label="SMTP Username"
                    value={settings.smtp_username || ''}
                    onChange={(e) => handleChange('smtp_username', e.target.value)}
                    placeholder="your-email@gmail.com"
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      SMTP Password
                    </label>
                    <div className="relative">
                      <input
                        type={showSmtpPassword ? 'text' : 'password'}
                        value={settings.smtp_password || ''}
                        onChange={(e) => handleChange('smtp_password', e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 pr-10 bg-white border border-neutral-200 rounded-xl text-sm
                                 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      >
                        {showSmtpPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Email Templates */}
              <section>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Settings size={20} className="text-primary-600" />
                  Email Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="From Name"
                    value={settings.email_from_name || ''}
                    onChange={(e) => handleChange('email_from_name', e.target.value)}
                    placeholder="Alak Oil and Gas"
                  />
                  <Input
                    label="From Email"
                    value={settings.email_from_address || ''}
                    onChange={(e) => handleChange('email_from_address', e.target.value)}
                    placeholder="noreply@alakoil.com"
                    type="email"
                  />
                  <Input
                    label="Reply-To Email"
                    value={settings.email_reply_to || ''}
                    onChange={(e) => handleChange('email_reply_to', e.target.value)}
                    placeholder="support@alakoil.com"
                    type="email"
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button
                        type="button"
                        onClick={() => handleToggle('email_enabled')}
                        className="text-primary-600"
                      >
                        {settings.email_enabled === 'true' ? (
                          <ToggleRight size={36} />
                        ) : (
                          <ToggleLeft size={36} className="text-neutral-400" />
                        )}
                      </button>
                      <span className="text-sm font-medium text-neutral-700">
                        Enable Email Notifications
                      </span>
                    </label>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Security Settings Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              {/* Session Settings */}
              <section>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-primary-600" />
                  Session Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Session Timeout (minutes)"
                    value={settings.session_timeout || ''}
                    onChange={(e) => handleChange('session_timeout', e.target.value)}
                    placeholder="60"
                    type="number"
                  />
                  <Input
                    label="Max Concurrent Sessions"
                    value={settings.session_max_concurrent || ''}
                    onChange={(e) => handleChange('session_max_concurrent', e.target.value)}
                    placeholder="3"
                    type="number"
                  />
                </div>
              </section>

              {/* Password Policy */}
              <section>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Key size={20} className="text-primary-600" />
                  Password Policy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Minimum Password Length"
                    value={settings.password_min_length || ''}
                    onChange={(e) => handleChange('password_min_length', e.target.value)}
                    placeholder="8"
                    type="number"
                  />
                  <Input
                    label="Password Expiry (days)"
                    value={settings.password_expiry_days || ''}
                    onChange={(e) => handleChange('password_expiry_days', e.target.value)}
                    placeholder="90"
                    type="number"
                    helperText="Set to 0 to disable password expiry"
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button
                        type="button"
                        onClick={() => handleToggle('password_require_uppercase')}
                        className="text-primary-600"
                      >
                        {settings.password_require_uppercase === 'true' ? (
                          <ToggleRight size={36} />
                        ) : (
                          <ToggleLeft size={36} className="text-neutral-400" />
                        )}
                      </button>
                      <span className="text-sm font-medium text-neutral-700">
                        Require uppercase letter
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button
                        type="button"
                        onClick={() => handleToggle('password_require_number')}
                        className="text-primary-600"
                      >
                        {settings.password_require_number === 'true' ? (
                          <ToggleRight size={36} />
                        ) : (
                          <ToggleLeft size={36} className="text-neutral-400" />
                        )}
                      </button>
                      <span className="text-sm font-medium text-neutral-700">
                        Require number
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button
                        type="button"
                        onClick={() => handleToggle('password_require_special')}
                        className="text-primary-600"
                      >
                        {settings.password_require_special === 'true' ? (
                          <ToggleRight size={36} />
                        ) : (
                          <ToggleLeft size={36} className="text-neutral-400" />
                        )}
                      </button>
                      <span className="text-sm font-medium text-neutral-700">
                        Require special character
                      </span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Security Features */}
              <section>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Lock size={20} className="text-primary-600" />
                  Security Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Max Login Attempts"
                    value={settings.security_max_login_attempts || ''}
                    onChange={(e) => handleChange('security_max_login_attempts', e.target.value)}
                    placeholder="5"
                    type="number"
                  />
                  <Input
                    label="Lockout Duration (minutes)"
                    value={settings.security_lockout_duration || ''}
                    onChange={(e) => handleChange('security_lockout_duration', e.target.value)}
                    placeholder="15"
                    type="number"
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button
                        type="button"
                        onClick={() => handleToggle('security_2fa_enabled')}
                        className="text-primary-600"
                      >
                        {settings.security_2fa_enabled === 'true' ? (
                          <ToggleRight size={36} />
                        ) : (
                          <ToggleLeft size={36} className="text-neutral-400" />
                        )}
                      </button>
                      <span className="text-sm font-medium text-neutral-700">
                        Enable Two-Factor Authentication
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button
                        type="button"
                        onClick={() => handleToggle('security_ip_whitelist')}
                        className="text-primary-600"
                      >
                        {settings.security_ip_whitelist === 'true' ? (
                          <ToggleRight size={36} />
                        ) : (
                          <ToggleLeft size={36} className="text-neutral-400" />
                        )}
                      </button>
                      <span className="text-sm font-medium text-neutral-700">
                        Enable IP Whitelist
                      </span>
                    </label>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              {/* Admin Notifications */}
              <section>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Bell size={20} className="text-primary-600" />
                  Admin Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div>
                      <p className="font-medium text-neutral-900">New Inquiry Notifications</p>
                      <p className="text-sm text-neutral-500">Receive email when a new inquiry is submitted</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('notification_new_inquiry')}
                      className="text-primary-600"
                    >
                      {settings.notification_new_inquiry === 'true' ? (
                        <ToggleRight size={36} />
                      ) : (
                        <ToggleLeft size={36} className="text-neutral-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div>
                      <p className="font-medium text-neutral-900">Daily Summary</p>
                      <p className="text-sm text-neutral-500">Receive daily summary of inquiry activity</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('notification_daily_summary')}
                      className="text-primary-600"
                    >
                      {settings.notification_daily_summary === 'true' ? (
                        <ToggleRight size={36} />
                      ) : (
                        <ToggleLeft size={36} className="text-neutral-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div>
                      <p className="font-medium text-neutral-900">Security Alerts</p>
                      <p className="text-sm text-neutral-500">Receive alerts for security-related events</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('notification_security_alerts')}
                      className="text-primary-600"
                    >
                      {settings.notification_security_alerts === 'true' ? (
                        <ToggleRight size={36} />
                      ) : (
                        <ToggleLeft size={36} className="text-neutral-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div>
                      <p className="font-medium text-neutral-900">System Updates</p>
                      <p className="text-sm text-neutral-500">Receive notifications about system updates</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('notification_system_updates')}
                      className="text-primary-600"
                    >
                      {settings.notification_system_updates === 'true' ? (
                        <ToggleRight size={36} />
                      ) : (
                        <ToggleLeft size={36} className="text-neutral-400" />
                      )}
                    </button>
                  </div>
                </div>
              </section>

              {/* Notification Recipients */}
              <section>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Users size={20} className="text-primary-600" />
                  Notification Recipients
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Additional Email Recipients
                    </label>
                    <Textarea
                      value={settings.notification_recipients || ''}
                      onChange={(e) => handleChange('notification_recipients', e.target.value)}
                      placeholder="email1@example.com&#10;email2@example.com"
                      rows={3}
                      helperText="Enter one email address per line"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 shadow-lg flex items-center gap-4 z-50">
          <AlertCircle size={20} className="text-amber-600" />
          <span className="text-sm font-medium text-amber-800">You have unsaved changes</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Discard
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
