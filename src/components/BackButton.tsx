// components/BackButton.tsx
"use client";

import Link from "next/link";

export default function BackButton() {
  return (
    <div className="mb-6">
      <Link
        href="/services"
        className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-lg 
                   font-medium hover:bg-gray-300 transition"
      >
        ← Back to Services
      </Link>
    </div>
  );
}
