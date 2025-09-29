"use client";
import { useState } from "react";
import Link from "next/link";

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();

    // Temporary mock tracking logic
    if (trackingId === "SP12345") {
      setStatus("✅ Package is in transit. Expected delivery: 2 days.");
    } else if (trackingId === "SP67890") {
      setStatus("📦 Package delivered successfully.");
    } else {
      setStatus("❌ Tracking ID not found. Please check and try again.");
    }
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      {/* Back to Logistics */}
      <div className="max-w-3xl mx-auto px-6 mb-8">
        <Link
          href="/logistics"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          ← Back to Logistics
        </Link>
      </div>

      {/* Tracker Content */}
      <div className="max-w-3xl mx-auto px-6 text-center bg-white rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-bold text-gray-900">Track Your Shipment</h1>
        <p className="mt-4 text-lg text-gray-600">
          Enter your tracking ID below to check the status of your shipment.
        </p>

        <form
          onSubmit={handleTrack}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <input
            type="text"
            placeholder="Enter Tracking ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Track
          </button>
        </form>

        {status && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-inner text-gray-800">
            {status}
          </div>
        )}
      </div>
    </section>
  );
}
