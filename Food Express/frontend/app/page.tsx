import { ChevronRight, Clock, MapPin, TrendingUp, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Delivery in 15-30 minutes',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Wide Selection',
      description: '500+ restaurants available',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Great Deals',
      description: 'Exclusive offers & discounts',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: '24/7 Service',
      description: 'Order anytime, day or night',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200/20 dark:bg-accent-900/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container-premium">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                  Hungry? Your{' '}
                  <span className="bg-gradient-premium bg-clip-text text-transparent">
                    Favorite Food
                  </span>
                  {' '}is Just a Tap Away
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  Order from the best restaurants around and enjoy premium food with lightning-fast delivery.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/restaurants"
                  className="btn-primary text-lg px-8 py-3 group inline-flex justify-center sm:justify-start"
                >
                  Order Now
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="btn-outline text-lg px-8 py-3"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">500+</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Restaurants</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">50k+</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Happy Customers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">30min</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avg Delivery</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-96 md:h-[500px] animate-fade-in-slow">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-300 to-accent-300 dark:from-primary-900/30 dark:to-accent-900/30 rounded-3xl blur-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=500&fit=crop"
                alt="Delicious food"
                className="relative w-full h-full object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="container-premium">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Why Choose Food Express?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Premium service with unbeatable convenience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-premium p-6 text-center hover:scale-105 transition-transform hover:shadow-lg cursor-pointer"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container-premium">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">How It Works</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Simple steps to your favorite meal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Browse', desc: 'Explore restaurants' },
              { step: 2, title: 'Order', desc: 'Add items to cart' },
              { step: 3, title: 'Pay', desc: 'Secure checkout' },
              { step: 4, title: 'Enjoy', desc: 'Food at your door' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-premium text-white text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-premium text-white">
        <div className="container-premium text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Order?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers enjoying premium food delivery.
          </p>
          <Link href="/restaurants" className="btn-primary bg-white text-primary-600 hover:bg-slate-100 inline-block">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  )
}
