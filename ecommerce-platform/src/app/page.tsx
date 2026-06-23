import ProductCard from '@/components/Product/ProductCard'
import { Product } from '@/types'
import Link from 'next/link'
import HeroCTA from '@/components/common/HeroCTA'
import api from '@/services/api'

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await api.get('/products?limit=12&sortBy=featured')
    return res.data?.data?.data || []
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    const res = await api.get('/categories')
    return res.data?.data || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.allSettled([
    getFeaturedProducts(),
    getCategories(),
  ]).then((results) =>
    results.map((r) => (r.status === 'fulfilled' ? r.value : []))
  )

  return (
    <main className="min-h-screen bg-slate-50">

      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to ShopHub</h1>
          <p className="text-emerald-100 text-xl mb-8">
            Premium products, unbeatable prices.
          </p>
          <HeroCTA />
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="p-4 bg-white rounded-xl border"
              >
                <div className="text-center">
                  <p className="font-medium">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No products found</p>
        )}
      </section>

    </main>
  )
}