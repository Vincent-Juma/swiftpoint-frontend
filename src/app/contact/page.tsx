// app/contact/page.tsx
export default function Contact() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        {/* Page Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Get in Touch</h1>
          <p className="mt-4 text-lg text-gray-600">
            We’re here to support your logistics, rides, and e-commerce needs.  
            Reach out anytime and we’ll respond promptly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white shadow rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6">
              Send us a Message
            </h2>
            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                rows={4}
                placeholder="Your Message"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">📍 Address</h3>
              <p className="text-gray-600 mt-2">
                Nairobi, Kenya  
                SwiftPoint Logistics HQ
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">📞 Phone</h3>
              <p className="text-gray-600 mt-2">+254 722 250 875</p>
              <p className="text-gray-600 mt-2">+254 708 429 257</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">📧 Email</h3>
              <p className="text-gray-600 mt-2">info@swiftpointlogistics.co.ke</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">🕒 Hours</h3>
              <p className="text-gray-600 mt-2">Mon - Sat: 8:00am - 6:00pm</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
