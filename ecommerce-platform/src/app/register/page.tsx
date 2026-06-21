import { Metadata } from 'next'
import RegisterForm from '@/components/Auth/RegisterForm'

export const metadata: Metadata = { title: 'Create Account' }

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">ShopHub</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-6">
            Join 50,000+<br />happy shoppers.
          </h2>
          <p className="text-emerald-100 text-lg leading-relaxed">
            Create your free account and unlock exclusive deals, fast checkout, and order tracking.
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          {[
            '🚀 Free delivery on orders over $50',
            '🔒 Secure payments with Stripe',
            '↩️  Easy 30-day returns',
            '📦 Real-time order tracking',
          ].map(benefit => (
            <div key={benefit} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <p className="text-sm text-emerald-50">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <RegisterForm />
      </div>
    </div>
  )
}