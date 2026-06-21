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

// Yup validation schema — rules for every field
const LoginSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

export default function LoginForm() {
  const dispatch    = useAppDispatch()
  const router      = useRouter()
  const { showToast } = useToast()
  const [serverError, setServerError] = useState('')

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('')
      try {
        const res = await api.post<{
          data: { user: User; token: string; refreshToken: string }
        }>('/auth/login', {
          email:    values.email,
          password: values.password,
        })

        const { user, token, refreshToken } = res.data.data

        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)
        document.cookie = `token=${token}; path=/; max-age=604800`

        dispatch(loginSuccess({ user, token }))

        showToast(`Welcome back, ${user.firstName}!`, 'success')
        router.push('/dashboard')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Login failed'
        setServerError(message)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
        <p className="text-slate-500">Sign in to your ShopHub account</p>
      </div>

      {/* Demo credentials hint */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-700 font-medium mb-1">Demo credentials</p>
        <p className="text-xs text-blue-600">Email: demo@shophub.com</p>
        <p className="text-xs text-blue-600">Password: password123</p>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          // Only show error if field was touched (user visited it)
          error={formik.touched.email ? formik.errors.email : undefined}
          required
          autoComplete="email"
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password ? formik.errors.password : undefined}
          required
          autoComplete="current-password"
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            <span className="text-sm text-slate-600">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-emerald-600 hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        <Button
          label="Sign In"
          type="submit"
          isLoading={formik.isSubmitting}
          disabled={formik.isSubmitting}
          fullWidth
          size="lg"
        />
      </form>

      <p className="text-center text-sm text-slate-500 mt-8">
        Don't have an account?{' '}
        <Link href="/register" className="text-emerald-600 font-semibold hover:underline">
          Create one free
        </Link>
      </p>
    </div>
  )
}