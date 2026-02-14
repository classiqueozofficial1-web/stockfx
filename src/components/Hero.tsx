
export const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-20 md:py-40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100/20 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="w-full md:w-1/2 animate-slideInLeft">
            {/* Greeting Badge */}
            <div className="inline-block mb-6 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full">
              <span className="text-sm font-semibold text-primary-700">👋 Welcome to StockFx</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="block text-dark-950">Master Your</span>
              <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Trading Journey
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-dark-600 mb-8 leading-relaxed max-w-xl">
              A powerful platform for forex and stocks trading. Advanced analytics, 
              real-time data, and professional tools to help you make informed decisions 
              and grow your wealth.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="h-12 px-8 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                Get Started Free
              </a>
              <a
                href="#projects"
                className="h-12 px-8 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center"
              >
                Learn More
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-col gap-3 text-sm text-dark-600">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Trusted by 50,000+ traders</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Real-time market data & analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>24/7 professional support</span>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="w-full md:w-1/2 animate-slideInRight">
            <div className="relative">
              {/* Gradient Background Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-accent-600/20 rounded-3xl blur-2xl"></div>
              
              {/* Image Container */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl transform -rotate-3 scale-95 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <img
                  src="https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                  alt="Trading Platform Interface"
                  className="relative z-10 w-full rounded-3xl object-cover shadow-2xl transition-all duration-300"
                />
              </div>

              {/* Stats Cards - Floating */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-dark-100 max-w-xs animate-slideInUp">
                <div className="text-3xl font-bold text-primary-600">$2.5M+</div>
                <p className="text-sm text-dark-600">Daily Trading Volume</p>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-dark-100 max-w-xs animate-slideInUp" style={{ animationDelay: '0.1s' }}>
                <div className="text-3xl font-bold text-accent-600">98.5%</div>
                <p className="text-sm text-dark-600">Uptime Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};