import ProductCard from '@/components/Product/ProductCard'
import { Product } from '@/types'
import Link from 'next/link'
import HeroCTA from '@/components/common/HeroCTA'

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?limit=4&sortBy=featured`,
      {
        next: { revalidate: 1800 },
        cache: "force-cache",
      }
    )

    if (!res.ok) return []
    const data = await res.json()
    return data.data?.data || []
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      {
        next: { revalidate: 3600 },
        cache: "force-cache",
      }
    )

    if (!res.ok) return []
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.allSettled([
    getFeaturedProducts(),
    getCategories(),
  ]).then((results) =>
    results.map((r) => (r.status === "fulfilled" ? r.value : []))
  )

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Welcome to ShopHub
          </h1>
          <p className="text-emerald-100 text-xl mb-8 max-w-2xl mx-auto">
            Premium products, unbeatable prices. Shop thousands of items with fast delivery.
          </p>
          <HeroCTA />
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Shop by Category
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map(
              (cat: { id: string; name: string; slug: string }) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-sm transition-all group"
                >
                  <span className="text-2xl">
                    {cat.slug === 'laptops'
                      ? '💻'
                      : cat.slug === 'phones'
                      ? '📱'
                      : cat.slug === 'audio'
                      ? '🎧'
                      : cat.slug === 'tablets'
                      ? '📱'
                      : cat.slug === 'wearables'
                      ? '⌚'
                      : '🖥️'}
                  </span>

                  <span className="text-xs font-medium text-slate-600 group-hover:text-emerald-600 text-center">
                    {cat.name}
                  </span>
                </Link>
              )
            )}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-6 py-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              Featured Products
            </h2>
            <p className="text-slate-500 mt-1">
              Handpicked for you today
            </p>
          </div>

          <Link
            href="/products"
            className="text-emerald-600 font-semibold hover:underline"
          >
            View all →
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p>No products available right now. Check back soon!</p>
          </div>
        )}
      </section>

    </main>
  )
}