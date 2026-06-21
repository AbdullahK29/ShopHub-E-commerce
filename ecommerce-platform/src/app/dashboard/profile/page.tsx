'use client'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { loginSuccess } from '@/store/slices/authSlice'
import { useToast } from '@/components/common/Toast'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

const ProfileSchema = Yup.object({
  firstName: Yup.string().min(2).required('Required'),
  lastName:  Yup.string().min(2).required('Required'),
  email:     Yup.string().email('Invalid email').required('Required'),
  phone:     Yup.string().optional(),
})

export default function ProfilePage() {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const { showToast } = useToast()

  const formik = useFormik({
    enableReinitialize: true,  // update form when user data loads
    initialValues: {
      firstName: user?.firstName || '',
      lastName:  user?.lastName  || '',
      email:     user?.email     || '',
      phone:     user?.phone     || '',
    },
    validationSchema: ProfileSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await new Promise(r => setTimeout(r, 800))
        if (user) {
          dispatch(loginSuccess({
            user: { ...user, ...values },
            token: 'mock-token',
          }))
        }
        showToast('Profile updated successfully!', 'success')
      } catch {
        showToast('Failed to update profile', 'error')
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800">Profile Settings</h1>
        <p className="text-slate-500 mt-1">Manage your personal information</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
          <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : '?'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-lg">{user?.firstName} {user?.lastName}</p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <button className="text-sm text-emerald-600 font-medium hover:underline mt-1">
              Change avatar
            </button>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First name" name="firstName"
              value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.firstName ? formik.errors.firstName : undefined} required />
            <Input label="Last name" name="lastName"
              value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.lastName ? formik.errors.lastName : undefined} required />
          </div>
          <Input label="Email address" name="email" type="email"
            value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
            error={formik.touched.email ? formik.errors.email : undefined} required />
          <Input label="Phone number" name="phone" type="tel" placeholder="+1 (555) 000-0000"
            value={formik.values.phone || ''} onChange={formik.handleChange} onBlur={formik.handleBlur}
            hint="Optional — used for order notifications" />

          <div className="flex gap-3 pt-2">
            <Button label="Save Changes" type="submit"
              isLoading={formik.isSubmitting} size="lg" />
            <Button label="Cancel" variant="secondary"
              onClick={() => formik.resetForm()} size="lg" />
          </div>
        </form>
      </div>
    </div>
  )
}