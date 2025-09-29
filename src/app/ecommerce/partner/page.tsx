"use client";

import { useState } from "react";
import Link from "next/link";

export default function Partner() {
  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    businessType: "",
    monthlyOrders: "",
    averageParcelWeight: "",
    specialRequirements: "",
    integrationNeeds: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just mock submit
    console.log("Partner Form Submitted:", form);
    setSubmitted(true);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* === HERO === */}
      <section className="bg-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Partner with SwiftPoint Logistics
          </h1>
          <p className="mt-4 text-blue-100 text-lg">
            Join forces with Kenya’s most agile logistics platform to deliver
            faster, reduce costs, and enhance your customers’ experience.
          </p>
          <div className="mt-6">
            <Link
              href="/services"
              className="inline-block bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
            >
              ← Back to Services
            </Link>
          </div>
        </div>
      </section>

      {/* === FORM SECTION === */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 bg-white rounded-2xl shadow-lg p-8">
          {!submitted ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 text-center">
                Partnership Inquiry Form
              </h2>
              <p className="text-gray-600 text-center mt-2">
                Tell us about your business. We’ll get in touch to discuss
                tailored solutions for your logistics needs.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={form.contactPerson}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Business Type
                  </label>
                  <select
                    name="businessType"
                    value={form.businessType}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your business type</option>
                    <option value="E-commerce">E-commerce Platform</option>
                    <option value="Retail">Retailer</option>
                    <option value="Wholesaler">Wholesaler / Distributor</option>
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Monthly Orders & Avg Weight */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Estimated Monthly Orders
                    </label>
                    <input
                      type="number"
                      name="monthlyOrders"
                      value={form.monthlyOrders}
                      onChange={handleChange}
                      className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Average Parcel Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="averageParcelWeight"
                      value={form.averageParcelWeight}
                      onChange={handleChange}
                      className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Special Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Special Handling Requirements
                  </label>
                  <select
                    name="specialRequirements"
                    value={form.specialRequirements}
                    onChange={handleChange}
                    className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select if applicable</option>
                    <option value="Fragile">Fragile Items</option>
                    <option value="Perishable">Perishable Goods</option>
                    <option value="Hazardous">Hazardous Materials</option>
                    <option value="Oversized">Oversized Items</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Integration Needs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Integration Needs
                  </label>
                  <select
                    name="integrationNeeds"
                    value={form.integrationNeeds}
                    onChange={handleChange}
                    className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select if applicable</option>
                    <option value="API">API for Real-time Tracking</option>
                    <option value="Plugin">E-commerce Platform Plugin</option>
                    <option value="WarehouseSync">
                      Warehouse Management Integration
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Additional Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us more about your business goals or partnership expectations..."
                    className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  Submit Partnership Request
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-green-600">
                ✅ Request Submitted!
              </h2>
              <p className="mt-4 text-gray-700">
                Thank you for reaching out. Our team will contact you shortly to
                discuss next steps.
              </p>
              <div className="mt-6">
                <Link
                  href="/services"
                  className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-800 transition"
                >
                  ← Back to Services
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
