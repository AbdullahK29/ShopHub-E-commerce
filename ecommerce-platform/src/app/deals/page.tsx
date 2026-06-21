import Link from 'next/link'

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <span className="text-6xl mb-6 block">🏷️</span>
        <h1 className="text-3xl font-bold text-slate-800 mb-3">Deals Coming Soon</h1>
        <p className="text-slate-500 mb-8">
          We're working on exclusive deals for you. Check back soon for amazing discounts!
        </p>
        <Link href="/products"
          className="bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
          Browse All Products
        </Link>
      </div>
    </div>
  )
}