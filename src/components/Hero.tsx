
export const Hero = () => {
  return (
    <section id="home" className="pt-24 pb-16 md:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h2 className="text-3xl md:text-5xl font-light text-stone-800 mb-6">
              <span className="block">こんにちは</span>
              <span className="block mt-2">I'm Taro Yamada</span>
            </h2>
            <p className="text-lg md:text-xl text-stone-600 mb-8 leading-relaxed">
              A passionate web developer and designer with a love for Japanese
              aesthetics and minimalist design principles.
            </p>
            <div className="flex space-x-4">
              <a
                href="#contact"
                className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-md transition-colors duration-300">

                Get in Touch
              </a>
              <a
                href="#projects"
                className="px-6 py-3 border border-indigo-900 text-indigo-900 hover:bg-indigo-900 hover:text-white rounded-md transition-colors duration-300">

                View Projects
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative">
            <div className="aspect-square max-w-md mx-auto relative">
              <div className="absolute inset-0 bg-indigo-900/10 rounded-3xl transform rotate-6"></div>
              <img
                src="https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Japanese garden with cherry blossoms"
                className="rounded-3xl object-cover w-full h-full relative z-10 shadow-lg" />

            </div>
          </div>
        </div>
      </div>
    </section>);

};