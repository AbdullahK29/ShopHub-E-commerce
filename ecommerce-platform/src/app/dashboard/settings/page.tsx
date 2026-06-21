'use client'

import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useToast } from '@/components/common/Toast'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import api from '@/services/api'

const PasswordSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
    .required('Please confirm your password'),
})

export default function SettingsPage() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<'password' | 'notifications' | 'danger'>('password')

  const [notifications, setNotifications] = useState({
    orderUpdates:  true,
    promotions:    false,
    newArrivals:   true,
    newsletter:    false,
  })

  const passwordFormik = useFormik({
    initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema: PasswordSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await api.put('/users/me/password', {
          currentPassword: values.currentPassword,
          newPassword:     values.newPassword,
        })
        showToast('Password changed successfully!', 'success')
        resetForm()
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to change password'
        showToast(message, 'error')
      } finally {
        setSubmitting(false)
      }
    },
  })

  const tabs = [
    { key: 'password',      label: 'Password',       icon: '🔒' },
    { key: 'notifications', label: 'Notifications',  icon: '🔔' },
    { key: 'danger',        label: 'Danger Zone',    icon: '⚠️'  },
  ] as const

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={passwordFormik.handleSubmit} className="max-w-md space-y-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-5">Change Password</h2>

              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
                value={passwordFormik.values.currentPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                error={passwordFormik.touched.currentPassword ? passwordFormik.errors.currentPassword : undefined}
                required
              />
              <Input
                label="New Password"
                name="newPassword"
                type="password"
                placeholder="Min. 8 characters"
                value={passwordFormik.values.newPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                error={passwordFormik.touched.newPassword ? passwordFormik.errors.newPassword : undefined}
                hint="Must have 8+ characters, one uppercase, one number"
                required
              />
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                value={passwordFormik.values.confirmPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                error={passwordFormik.touched.confirmPassword ? passwordFormik.errors.confirmPassword : undefined}
                required
              />

              <Button
                label="Update Password"
                type="submit"
                isLoading={passwordFormik.isSubmitting}
                size="lg"
              />
            </form>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="max-w-md">
              <h2 className="text-lg font-semibold text-slate-800 mb-5">Email Notifications</h2>
              <div className="space-y-4">
                {[
                  { key: 'orderUpdates' as const,  label: 'Order Updates',   desc: 'Shipping, delivery, and order status changes' },
                  { key: 'promotions'  as const,  label: 'Promotions',      desc: 'Deals, discounts, and limited time offers'    },
                  { key: 'newArrivals' as const,  label: 'New Arrivals',    desc: 'Latest products added to ShopHub'             },
                  { key: 'newsletter'  as const,  label: 'Newsletter',      desc: 'Monthly digest and tech news'                 },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        notifications[item.key] ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                label="Save Preferences"
                className="mt-6"
                onClick={() => showToast('Notification preferences saved!', 'success')}
                size="lg"
              />
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div className="max-w-md">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Danger Zone</h2>
              <p className="text-slate-500 text-sm mb-6">
                These actions are permanent and cannot be undone.
              </p>

              <div className="border border-red-200 rounded-2xl p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Delete Account</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Permanently delete your account and all your data including orders, profile, and wishlist.
                  </p>
                  <button
                    onClick={() => showToast('Please contact support to delete your account', 'info')}
                    className="bg-red-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete My Account
                  </button>
                </div>

                <hr className="border-red-100" />

                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Export Data</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Download all your personal data including orders, profile, and activity.
                  </p>
                  <button
                    onClick={() => showToast('Data export will be emailed to you shortly', 'success')}
                    className="border border-slate-300 text-slate-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                  >
                    Export My Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}