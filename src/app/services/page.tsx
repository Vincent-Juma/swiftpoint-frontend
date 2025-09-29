// app/services/page.tsx
"use client";

import Link from "next/link";

export default function Services() {
  const services = [
    {
      title: "Logistics & Delivery",
      description:
        "Swift, reliable, and secure delivery solutions across towns and borders. From last-mile delivery to bulk freight, we ensure timely arrivals.",
      icon: "🚚",
      href: "/logistics", // ✅ Linked to logistics page
    },
    {
      title: "Rides & Transport",
      description:
        "Affordable and convenient ride services for individuals and businesses. Whether daily commutes or on-demand rides, SwiftPoint gets you there.",
      icon: "🚖",
      href: "/rides", // ✅ Linked to rides page
    },
    {
      title: "E-commerce Fulfillment",
      description:
        "Helping online businesses scale by providing warehousing, packaging, and direct-to-customer delivery for orders nationwide.",
      icon: "📦",
      href: "/ecommerce", // ✅ Linked to ecommerce page
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Our Services</h1>
        <p className="mt-4 text-lg text-gray-600">
          Explore SwiftPoint Logistics solutions designed to move people,
          products, and businesses forward.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {services.map((service, index) => (
            <Link key={index} href={service.href}>
              <div
                className="bg-white p-8 rounded-2xl shadow hover:shadow-lg 
                           transition cursor-pointer hover:border-blue-500"
              >
                <div className="text-5xl">{service.icon}</div>
                <h2 className="mt-4 text-2xl font-semibold text-blue-700">
                  {service.title}
                </h2>
                <p className="mt-2 text-gray-600">{service.description}</p>

                <button className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Explore
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
