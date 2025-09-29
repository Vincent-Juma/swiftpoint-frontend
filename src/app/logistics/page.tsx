"use client";
import Link from "next/link";

export default function LogisticsHome() {
  return (
    <main className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center text-blue-700">
          Logistics & Delivery
        </h1>
        <p className="mt-4 text-center text-gray-600">
          Swift, reliable and secure delivery solutions across towns and borders.
          Manage your orders and track shipments easily.
        </p>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Place Order Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition">
            <h2 className="text-2xl font-semibold text-blue-700">
              Place a Shipment Order
            </h2>
            <p className="mt-4 text-gray-600">
              Book a delivery, specify the package details and schedule pickup.
            </p>
            <Link
              href="/logistics/order"
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Go to Order Form →
            </Link>
          </div>

          {/* Track Shipment Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition">
            <h2 className="text-2xl font-semibold text-blue-700">
              Track Your Shipment
            </h2>
            <p className="mt-4 text-gray-600">
              Enter your tracking ID to see live shipment status.
            </p>
            <Link
              href="/logistics/track"
              className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
            >
              Go to Tracker →
            </Link>
          </div>
          </div>
          {/* === SERVICES GRID === */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Our Core Solutions
        </h2>
        <p className="text-center text-gray-600 mt-3">
          Flexible services to help you scale your online business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              title: "Last-Mile Delivery",
              desc: "Nationwide on-demand delivery at competitive rates for small parcels and large goods.",
            },
            {
              title: "Pick-up & Drop-off (PUDO)",
              desc: "Convenient partner shops for pick-ups and returns, reducing delivery costs for both sides.",
            },
            {
              title: "Micro-Fulfilment Hubs",
              desc: "Urban hubs for inventory storage & same-day dispatch, cutting delivery time to hours.",
            },
            {
              title: "Cash-on-Delivery Support",
              desc: "Secure COD collection and automated reconciliation for online stores.",
            },
            {
              title: "Subscription & Bulk Plans",
              desc: "Discounted rates for frequent shippers, subscription-based delivery and fulfilment.",
            },
            {
              title: "Eco-Smart Logistics",
              desc: "Green, solar-assisted last-mile options to reduce cost and environmental impact.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {s.title}
              </h3>
              <p className="mt-2 text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
      </div>
    </main>
  );
}
