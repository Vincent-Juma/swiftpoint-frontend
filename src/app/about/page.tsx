export const metadata = {
    title: "About — SwiftPoint Logistics",
    description:
      "SwiftPoint Logistics: technology-driven logistics, rides and e-commerce fulfilment tailored for individuals, SMEs and enterprises across Kenya and beyond.",
  };
  
  import Link from "next/link";

export default function AboutPage() {
  return (
      <main className="bg-gray-50 min-h-screen">
        {/* HERO */}
        <section className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="md:flex md:items-center md:justify-between gap-6">
              <div className="md:w-2/3">
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  SwiftPoint Logistics — Reliable logistics, local roots, global ambition
                </h1>
                <p className="mt-4 text-lg text-blue-100 leading-relaxed max-w-2xl">
                  We combine Kenyan operational expertise with modern technology to deliver dependable, scalable and cost-effective
                  logistics, rides and e‑commerce fulfilment services. From single-package pickups to enterprise-level supply chain
                  programs, SwiftPoint makes movement predictable and profitable.
                </p>
  
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-3 rounded-lg font-semibold shadow hover:opacity-95"
                  >
                    Explore Services
                  </Link>
  
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-transparent border border-white text-white px-5 py-3 rounded-lg font-medium hover:bg-white/10"
                  >
                    Request a Quote
                  </Link>
                </div>
  
                <div className="mt-6 text-sm text-blue-100">Contact operations: <strong>+254 722 250 875</strong></div>
              </div>
  
              <div className="hidden md:block md:w-1/3">
                <div className="rounded-xl bg-white/5 p-4">
                  <h4 className="text-sm text-blue-100 font-semibold">What we offer</h4>
                  <ul className="mt-3 text-sm text-blue-50 space-y-2">
                    <li>End-to-end fulfilment for online sellers</li>
                    <li>Flexible ride & transport services</li>
                    <li>Transparent pricing and live tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* MISSION & VISION */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Our mission</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                To simplify movement — of goods and people — by delivering dependable, secure and tech-enabled logistics solutions
                that help businesses scale and communities thrive.
              </p>
  
              <h2 className="text-2xl font-bold text-gray-800 mt-6">Our vision</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                To be the most trusted logistics partner in East Africa, known for predictable performance, measurable savings and
                an exceptional customer experience.
              </p>
            </div>
  
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold text-lg text-gray-800">Core values</h3>
              <ul className="mt-4 space-y-3 text-gray-600">
                <li>Customer-first: Every process starts with the customer’s outcome.</li>
                <li>Integrity: Transparent pricing and honest timelines.</li>
                <li>Operational excellence: Reliable performance, every time.</li>
                <li>Innovation: Practical technology that reduces cost and friction.</li>
                <li>Community: Support for SMEs and local economic growth.</li>
              </ul>
            </div>
          </div>
        </section>
  
        {/* SERVICES HIGHLIGHTS */}
        <section className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-xl font-semibold text-gray-800">Our core solutions</h3>
            <p className="text-gray-600 mt-2">Integrated services designed to serve individuals, SMEs and enterprises.</p>
  
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <article className="border rounded-xl p-5 hover:shadow-md transition">
                <h4 className="font-semibold text-lg text-gray-800">Logistics & Delivery</h4>
                <p className="text-sm text-gray-600 mt-2">Last-mile, intercity and bulk freight with predictable SLAs and live tracking. Cost-efficient route bundling reduces per‑order fees.</p>
                <Link href="/logistics" className="mt-4 inline-block text-sm text-blue-700 font-medium">Learn more →</Link>
              </article>
  
              <article className="border rounded-xl p-5 hover:shadow-md transition">
                <h4 className="font-semibold text-lg text-gray-800">Rides & Transport</h4>
                <p className="text-sm text-gray-600 mt-2">On-demand and scheduled rides for customers and staff, backed by driver verification and performance monitoring.</p>
                <Link href="/rides" className="mt-4 inline-block text-sm text-blue-700 font-medium">Learn more →</Link>
              </article>
  
              <article className="border rounded-xl p-5 hover:shadow-md transition">
                <h4 className="font-semibold text-lg text-gray-800">E‑commerce Fulfilment</h4>
                <p className="text-sm text-gray-600 mt-2">Warehousing, pick‑and‑pack, returns handling and marketplace connectors that increase seller margins and reduce time‑to‑customer.</p>
                <Link href="/ecommerce" className="mt-4 inline-block text-sm text-blue-700 font-medium">Learn more →</Link>
              </article>
            </div>
          </div>
        </section>
  
        {/* WHY CHOOSE US */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h3 className="text-xl font-semibold text-gray-800">Why customers choose SwiftPoint</h3>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl p-5 shadow">
              <h4 className="font-semibold">Transparent pricing</h4>
              <p className="text-sm text-gray-600 mt-2">Clear cost breakdowns and a live estimator help businesses predict margins and plan inventory.</p>
            </div>
  
            <div className="bg-white rounded-xl p-5 shadow">
              <h4 className="font-semibold">Technology-first</h4>
              <p className="text-sm text-gray-600 mt-2">Modern APIs, real-time tracking and order dashboards so you measure performance and service levels.</p>
            </div>
  
            <div className="bg-white rounded-xl p-5 shadow">
              <h4 className="font-semibold">Operational reliability</h4>
              <p className="text-sm text-gray-600 mt-2">Local teams, local knowledge and SLA options that make your deliveries dependable.</p>
            </div>
          </div>
  
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 shadow">
              <h4 className="font-semibold">SME-first programs</h4>
              <p className="text-sm text-gray-600 mt-2">Onboarding, flexible pricing tiers and simple reconciliation to help small businesses scale online with predictable costs.</p>
            </div>
  
            <div className="bg-white rounded-xl p-5 shadow">
              <h4 className="font-semibold">Enterprise services</h4>
              <p className="text-sm text-gray-600 mt-2">Dedicated account management, scheduled pickups and SLAs for high-volume shippers and corporate clients.</p>
            </div>
          </div>
        </section>
  
        {/* TRUST & PARTNERS */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h4 className="text-lg font-semibold text-gray-800">Integration-ready & enterprise secure</h4>
            <p className="text-sm text-gray-600 mt-2">SwiftPoint is built to integrate with marketplaces and third-party platforms (marketplace connectors, courier APIs and enterprise security partners). Our platform is designed for easy connector development and secure operations.</p>
  
            <div className="mt-6 flex justify-center gap-6 flex-wrap items-center">
              {/* placeholders for partner logos */}
              <div className="bg-white/20 px-4 py-2 rounded">Jumia (integration-ready)</div>
              <div className="bg-white/20 px-4 py-2 rounded">Copia</div>
              <div className="bg-white/20 px-4 py-2 rounded">Sendy</div>
              <div className="bg-white/20 px-4 py-2 rounded">G4S (security partners)</div>
            </div>
          </div>
        </section>
  
        {/* CTA */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h4 className="text-xl font-semibold">Ready to move with certainty?</h4>
            <p className="text-gray-600 mt-2">Request a tailored quote, schedule a demo or onboard to our fulfilment service — our operations team will respond within one business day.</p>
  
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/contact" className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold">Request Quote</Link>
              <Link href="/signup" className="px-6 py-3 border rounded-lg">Start Onboarding</Link>
            </div>
  
            <div className="mt-4 text-sm text-gray-500">For immediate assistance call <strong>+254 722 250 875</strong></div>
          </div>
        </section>
  
        <section className="py-12 max-w-6xl mx-auto px-6">
          <div className="text-center text-xs text-gray-500">© {new Date().getFullYear()} SwiftPoint Logistics. All rights reserved.</div>
        </section>
      </main>
    );
  }
  