import Link from 'next/link'
import Button from '@/components/common/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-slate-200 mb-4 select-none">404</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Page not found</h1>
        <p className="text-slate-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button label="Go Home" size="lg" />
          </Link>
          <Link href="/products">
            <Button label="Browse Products" variant="outline" size="lg" />
          </Link>
        </div>
      </div>
    </div>
  )
}