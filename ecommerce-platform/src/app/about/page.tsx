export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-800 mb-6">About ShopHub</h1>

        <div className="bg-white rounded-2xl border border-slate-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed">
            ShopHub was built to make premium technology accessible to everyone. We curate
            the best products from top brands and deliver them to your door with unmatched
            speed and reliability.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { value: '50K+', label: 'Happy Customers' },
            { value: '1000+', label: 'Products'        },
            { value: '4.9★', label: 'Average Rating'   },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
              <p className="text-3xl font-bold text-emerald-600 mb-1">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Why ShopHub?</h2>
          <div className="space-y-3">
            {[
              { icon: '🔒', text: 'Secure payments with industry-standard encryption' },
              { icon: '📦', text: 'Free returns on all orders within 30 days'         },
              { icon: '⚡', text: 'Fast delivery — most orders arrive in 2-3 days'    },
              { icon: '🎧', text: '24/7 customer support ready to help'               },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <span className="text-xl">{item.icon}</span>
                <span className="text-slate-700 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}