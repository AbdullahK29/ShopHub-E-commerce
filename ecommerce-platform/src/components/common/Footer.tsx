// src/components/common/Footer.tsx
import Link from 'next/link'

const footerLinks = {
  Shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Deals',        href: '/deals' },
    { label: 'New Arrivals', href: '/new' },
    { label: 'Best Sellers', href: '/best-sellers' },
  ],
  Account: [
    { label: 'Login',         href: '/login' },
    { label: 'Register',      href: '/register' },
    { label: 'My Orders',     href: '/dashboard/orders' },
    { label: 'Profile',       href: '/dashboard/profile' },
  ],
  Company: [
    { label: 'About Us',      href: '/about' },
    { label: 'Contact',       href: '/contact' },
    { label: 'Privacy Policy',href: '/privacy' },
    { label: 'Terms of Use',  href: '/terms' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-white text-lg">ShopHub</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Premium products at unbeatable prices. Fast delivery, easy returns.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {['Twitter', 'Instagram', 'Facebook'].map((social) => (
                <a key={social} href="#"
                  className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors text-xs font-semibold">
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm hover:text-emerald-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} ShopHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span>🔒 Secure Checkout</span>
            <span>📦 Free Returns</span>
            <span>⚡ Fast Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  )
}