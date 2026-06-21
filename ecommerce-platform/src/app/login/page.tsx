import { Metadata } from 'next'
import LoginForm from '@/components/Auth/LoginForm'

export const metadata: Metadata = { title: 'Login' }

export default function LoginPage() {
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
            Shop smarter,<br />not harder.
          </h2>
          <p className="text-emerald-100 text-lg leading-relaxed">
            Access thousands of premium products with exclusive deals and lightning-fast delivery.
          </p>
        </div>

        {/* Social proof */}
        <div className="space-y-4">
          {[
            { name: 'Sarah M.',    text: 'Best online store I\'ve ever used.' },
            { name: 'James K.',    text: 'Fast delivery and great prices!'    },
          ].map(review => (
            <div key={review.name} className="bg-white/10 rounded-2xl p-4">
              <p className="text-sm text-emerald-50 mb-2">"{review.text}"</p>
              <p className="text-xs text-emerald-200 font-medium">— {review.name}</p>
            </div>
          ))}
          <p className="text-emerald-200 text-sm">
            ⭐ 4.9/5 from 50,000+ customers
          </p>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <LoginForm />
      </div>
    </div>
  )
}