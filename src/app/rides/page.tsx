"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import Link from "next/link"; // ✅ for back button navigation

// ---------------- Types ----------------
type Car = {
  id: string;
  category: string;
  name: string;
  seats: number;
  luggage: number;
  priceBase: number;
  pricePerKm: number;
  etaMin: number;
  rating: number;
  img?: string;
};

// ---------------- Data ----------------
const ALL_CARS: Car[] = [
  {
    id: "c-mid-1",
    category: "Mid-size SUV",
    name: "Hyundai Tucson",
    seats: 5,
    luggage: 3,
    priceBase: 250,
    pricePerKm: 40,
    etaMin: 6,
    rating: 4.6,
    img: "https://source.unsplash.com/400x300/?suv",
  },
  {
    id: "c-suv-1",
    category: "SUV",
    name: "Toyota Land Cruiser",
    seats: 7,
    luggage: 4,
    priceBase: 400,
    pricePerKm: 65,
    etaMin: 10,
    rating: 4.8,
    img: "https://source.unsplash.com/400x300/?jeep",
  },
  {
    id: "c-sal-1",
    category: "Saloon",
    name: "Toyota Corolla",
    seats: 4,
    luggage: 2,
    priceBase: 180,
    pricePerKm: 30,
    etaMin: 5,
    rating: 4.5,
    img: "https://source.unsplash.com/400x300/?sedan",
  },
  {
    id: "c-hatch-1",
    category: "Hatchback",
    name: "VW Polo",
    seats: 4,
    luggage: 1,
    priceBase: 150,
    pricePerKm: 25,
    etaMin: 4,
    rating: 4.2,
    img: "https://source.unsplash.com/400x300/?hatchback",
  },
  {
    id: "c-lux-1",
    category: "Luxury",
    name: "Mercedes E-Class",
    seats: 4,
    luggage: 3,
    priceBase: 700,
    pricePerKm: 120,
    etaMin: 8,
    rating: 4.9,
    img: "https://source.unsplash.com/400x300/?luxury-car",
  },
  {
    id: "c-van-1",
    category: "Van",
    name: "Toyota Hiace",
    seats: 12,
    luggage: 8,
    priceBase: 600,
    pricePerKm: 80,
    etaMin: 12,
    rating: 4.4,
    img: "https://source.unsplash.com/400x300/?van",
  },
];

const CATEGORIES = Array.from(new Set(ALL_CARS.map((c) => c.category)));

// ---------------- Component ----------------
export default function RidesPage(){
  // ---------------- State ----------------
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [asap, setAsap] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(
    ALL_CARS[0].id
  );

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [now, setNow] = useState(new Date());

  // ---------------- Effects ----------------
  useEffect(() => {
    const draft = localStorage.getItem("rideDraft");
    if (draft) {
      try {
        const d = JSON.parse(draft);
        setPickup(d.pickup ?? "");
        setDestination(d.destination ?? "");
        setAsap(d.asap ?? true);
        setDate(d.date ?? "");
        setTime(d.time ?? "");
        setSelectedCategory(d.selectedCategory ?? CATEGORIES[0]);
        setSelectedCarId(d.selectedCarId ?? ALL_CARS[0].id);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "rideDraft",
      JSON.stringify({ pickup, destination, asap, date, time, selectedCategory, selectedCarId })
    );
  }, [pickup, destination, asap, date, time, selectedCategory, selectedCarId]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (asap) {
      const dt = new Date();
      setDate(dt.toISOString().slice(0, 10));
      setTime(dt.toTimeString().slice(0, 5));
    }
  }, [asap]);

  useEffect(() => {
    if (!autoPlay) return;
    const idxTimer = setInterval(() => {
      const filtered = ALL_CARS.filter((c) => c.category === selectedCategory);
      setCarouselIndex((s) => (s + 1) % Math.max(1, filtered.length));
    }, 3500);
    return () => clearInterval(idxTimer);
  }, [autoPlay, selectedCategory]);

  useEffect(() => {
    const filtered = ALL_CARS.filter((c) => c.category === selectedCategory);
    const car = filtered[carouselIndex % filtered.length];
    if (car) setSelectedCarId(car.id);
  }, [carouselIndex, selectedCategory]);

  // ---------------- Utilities ----------------
  const filteredCars = ALL_CARS.filter((c) => c.category === selectedCategory);

  const estimateFare = (car: Car) => {
    const distanceGuess = pickup && destination ? 8 : 5;
    return {
      fare: Math.round(car.priceBase + car.pricePerKm * distanceGuess),
      distanceKm: distanceGuess,
    };
  };

  const selectedCar =
    ALL_CARS.find((c) => c.id === selectedCarId) ?? ALL_CARS[0];

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    alert("Booking requested! (Check console for payload)");
    console.log({
      pickup,
      destination,
      date,
      time,
      asap,
      car: selectedCar,
    });
    localStorage.removeItem("rideDraft");
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Booking Summary", 20, 20);
    doc.setFontSize(12);
    doc.text(`Pickup: ${pickup || "—"}`, 20, 40);
    doc.text(`Destination: ${destination || "—"}`, 20, 50);
    doc.text(
      `When: ${asap ? "Depart now" : `${date} ${time || ""}`}`,
      20,
      60
    );
    doc.text(`Category: ${selectedCategory}`, 20, 70);
    doc.text(`Car: ${selectedCar.name}`, 20, 80);
    doc.text(`Seats: ${selectedCar.seats}`, 20, 90);
    doc.text(`Rating: ${selectedCar.rating}`, 20, 100);
    doc.text(`Estimated Fare: KSH ${estimateFare(selectedCar).fare}`, 20, 110);
    doc.save("booking-summary.pdf");
  };

  // ---------------- JSX ----------------
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">

      {/* ✅ Back Button */}
      <div className="mb-6">
        <Link
          href="/services"
          className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-lg 
                     font-medium hover:bg-gray-300 transition"
        >
          ← Back to Services
        </Link>
      </div>

      {/* Intro */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-700">SwiftPoint Rides</h1>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          Seamless booking for on-demand and scheduled rides — for individuals, families, and businesses.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Call us: <strong>+254 722 250 875</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <form
          onSubmit={handleSubmit}
          className="col-span-2 bg-white p-6 rounded-2xl shadow-md space-y-4"
        >
          {/* Live clock + ASAP */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <div>Local time: <strong>{now.toLocaleTimeString()}</strong></div>
              <div className="text-xs text-gray-400">{now.toLocaleDateString()}</div>
            </div>
            <label className="flex items-center text-sm gap-2">
              <input
                type="checkbox"
                checked={asap}
                onChange={(e) => setAsap(e.target.checked)}
                className="h-4 w-4 text-blue-600"
              />
              Depart now
            </label>
          </div>

          {/* Pickup/Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Pickup location"
              className="border rounded px-3 py-2"
              required
            />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination"
              className="border rounded px-3 py-2"
              required
            />
          </div>

          {/* Date/Time */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded px-3 py-2"
              disabled={asap}
              required={!asap}
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border rounded px-3 py-2"
              disabled={asap}
              required={!asap}
            />
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setSelectedCategory(cat); setCarouselIndex(0); }}
                className={`px-4 py-1 rounded-full border text-sm ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cars Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-500"
              ref={carouselRef}
              style={{ transform: `translateX(-${carouselIndex * 240}px)` }}
            >
              {filteredCars.map((car) => (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  key={car.id}
                  onClick={() => setSelectedCarId(car.id)}
                  className={`min-w-[220px] p-3 rounded-xl shadow-sm border ${
                    selectedCarId === car.id
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : "border-gray-200"
                  } bg-gradient-to-br from-white to-gray-50 flex flex-col`}
                >
                  <div className="h-36 w-full rounded-md mb-3 overflow-hidden">
                    {car.img && <img src={car.img} alt={car.name} className="object-cover h-full w-full" />}
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <div className="font-semibold">{car.name}</div>
                      <div className="text-xs text-gray-500">
                        {car.seats} seats • {car.luggage} luggage
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        KSH {estimateFare(car).fare}
                      </div>
                      <div className="text-xs text-gray-400">
                        {estimateFare(car).distanceKm} km
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700"
            >
              Request Ride
            </button>
            <button
              type="button"
              onClick={() => {
                setPickup(""); setDestination(""); setAsap(true);
                setSelectedCategory(CATEGORIES[0]); setSelectedCarId(ALL_CARS[0].id);
                localStorage.removeItem("rideDraft");
              }}
              className="px-4 py-2 rounded-lg border"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Booking Summary */}
        <aside className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="font-semibold text-lg mb-2">Booking Summary</h2>
          <div className="text-sm text-gray-600 mb-4 space-y-1">
            <div><strong>Pickup:</strong> {pickup || "—"}</div>
            <div><strong>Destination:</strong> {destination || "—"}</div>
            <div><strong>When:</strong> {asap ? "Depart now" : `${date} ${time || ""}`}</div>
            <div><strong>Category:</strong> {selectedCategory}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Selected car</div>
                <div className="font-medium">{selectedCar.name}</div>
                <div className="text-xs text-gray-400">
                  {selectedCar.seats} seats • Rating {selectedCar.rating}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Est. fare</div>
                <div className="font-semibold">
                  KSH {estimateFare(selectedCar).fare}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handlePrintPDF}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Download PDF
          </button>
        </aside>
      </div>
    </section>
  );
}

