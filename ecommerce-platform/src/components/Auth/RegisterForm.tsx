'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import api from '@/services/api'
import { User } from '@/types'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { loginSuccess } from '@/store/slices/authSlice'
import { useToast } from '@/components/common/Toast'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

const RegisterSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'Must be at least 2 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Must be at least 2 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Must be at least 8 characters')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms')
    .required(),
})

export default function RegisterForm() {
  const dispatch      = useAppDispatch()
  const router        = useRouter()
  const { showToast } = useToast()
  const [serverError, setServerError] = useState('')

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('')
      try {
        const res = await api.post<{
          data: { user: User; token: string; refreshToken: string }
        }>('/auth/register', {
          firstName: values.firstName,
          lastName:  values.lastName,
          email:     values.email,
          password:  values.password,
        })

        const { user, token, refreshToken } = res.data.data

        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)
        document.cookie = `token=${token}; path=/; max-age=604800`

        dispatch(loginSuccess({ user, token }))

        showToast('Account created! Welcome to ShopHub 🎉', 'success')
        router.push('/dashboard')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Registration failed'
        setServerError(message)
      } finally {
        setSubmitting(false)
      }
    },
  })

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' }
    let score = 0
    if (password.length >= 8)          score++
    if (/[A-Z]/.test(password))        score++
    if (/[0-9]/.test(password))        score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    const map = [
      { strength: 0, label: '',         color: '' },
      { strength: 1, label: 'Weak',     color: 'bg-red-500' },
      { strength: 2, label: 'Fair',     color: 'bg-amber-500' },
      { strength: 3, label: 'Good',     color: 'bg-blue-500' },
      { strength: 4, label: 'Strong',   color: 'bg-emerald-500' },
    ]
    return map[score]
  }

  const passwordStrength = getPasswordStrength(formik.values.password)

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
        <p className="text-slate-500">Join thousands of happy ShopHub customers</p>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-5">

        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First name"
            name="firstName"
            placeholder="John"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName ? formik.errors.firstName : undefined}
            required
          />
          <Input
            label="Last name"
            name="lastName"
            placeholder="Doe"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName ? formik.errors.lastName : undefined}
            required
          />
        </div>

        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email ? formik.errors.email : undefined}
          required
          autoComplete="email"
        />

        <div>
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Min. 8 characters"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password ? formik.errors.password : undefined}
            hint="Must have 8+ characters, one uppercase, one number"
            required
          />
          {/* Password strength bar */}
          {formik.values.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                    i <= passwordStrength.strength ? passwordStrength.color : 'bg-slate-200'
                  }`} />
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Strength: <span className="font-medium">{passwordStrength.label}</span>
              </p>
            </div>
          )}
        </div>

        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword ? formik.errors.confirmPassword : undefined}
          required
        />

        {/* Terms checkbox */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formik.values.agreeToTerms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-slate-600">
              I agree to the{' '}
              <Link href="/terms" className="text-emerald-600 hover:underline font-medium">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-emerald-600 hover:underline font-medium">Privacy Policy</Link>
            </span>
          </label>
          {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
            <p className="text-xs text-red-500 mt-1 ml-7">{formik.errors.agreeToTerms}</p>
          )}
        </div>

        <Button
          label="Create Account"
          type="submit"
          isLoading={formik.isSubmitting}
          disabled={formik.isSubmitting}
          fullWidth
          size="lg"
        />
      </form>

      <p className="text-center text-sm text-slate-500 mt-8">
        Already have an account?{' '}
        <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}