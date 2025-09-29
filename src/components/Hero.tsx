// components/Hero.tsx
export default function Hero() {
    return (
      <section
        className="relative bg-cover bg-center h-[90vh] flex items-center justify-center"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
  
        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-3xl px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Swiftpoint Logistics
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-200">
            Your trusted partner in logistics, transportation, and supply chain
            solutions across Kenya and beyond.
          </p>
  
          {/* Call to Action buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/services"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg font-semibold transition"
            >
              Explore Services
            </a>
            <a
              href="/contact"
              className="bg-white hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg shadow-lg font-semibold transition"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    );
  }
  