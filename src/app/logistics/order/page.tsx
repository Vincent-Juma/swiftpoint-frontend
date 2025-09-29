// app/logistics/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Order = {
  trackingId: string;
  createdAt: string;
  status: string;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDate?: string;
  deliveryZone: string;
  serviceLevel: string;
  packageType: string;
  nature: string[]; // tags like Fragile, Perishable...
  weightKg: number;
  dimsCm?: { l: number; w: number; h: number } | null;
  declaredValue: number;
  insurance: boolean;
  cod: boolean;
  codAmount?: number;
  specialInstructions?: string;
  costBreakdown: {
    base: number;
    weightCharge: number;
    zoneMultiplier: number;
    fragileSurcharge: number;
    perishableSurcharge: number;
    electronicsSurcharge?: number;
    liquidSurcharge?: number;
    insuranceFee: number;
    codFee: number;
    handlingFee: number;
    other: number;
    total: number;
  };
};

function generateTrackingId() {
  // SP + 6 random digits
  return "SP" + Math.floor(100000 + Math.random() * 900000).toString();
}

function ksh(n: number) {
  return `KSh ${n.toLocaleString()}`;
}

export default function LogisticsPage() {
  /* --- Form state --- */
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [pickupDate, setPickupDate] = useState(""); // datetime-local string
  const [deliveryZone, setDeliveryZone] = useState("within_city");
  const [serviceLevel, setServiceLevel] = useState("standard");
  const [packageType, setPackageType] = useState("parcel");
  const [nature, setNature] = useState<string[]>([]); // checkboxes
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [dimL, setDimL] = useState<number | "">("");
  const [dimW, setDimW] = useState<number | "">("");
  const [dimH, setDimH] = useState<number | "">("");
  const [declaredValue, setDeclaredValue] = useState<number | "">("");
  const [insurance, setInsurance] = useState(false);
  const [cod, setCod] = useState(false);
  const [codAmount, setCodAmount] = useState<number | "">("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  /* --- Orders list (local demo persistence) --- */
  const [orders, setOrders] = useState<Order[]>([]);

  /* --- Order summary after placing --- */
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const printableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // load persisted orders from localStorage for demo
    try {
      const raw = localStorage.getItem("sp_orders_v1");
      if (raw) setOrders(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sp_orders_v1", JSON.stringify(orders));
    } catch {}
  }, [orders]);

  /* --- Dimension / weight helpers --- */
  const dimsProvided = dimL !== "" && dimW !== "" && dimH !== "";
  const dims = dimsProvided
    ? { l: Number(dimL), w: Number(dimW), h: Number(dimH) }
    : null;

  /* --- Cost calculation logic (clear step-by-step) --- */
  const costBreakdown = useMemo(() => {
    // Defensive conversions
    const w = Number(weightKg) || 0;
    const l = dims?.l || 0;
    const wi = dims?.w || 0;
    const h = dims?.h || 0;
    const dv = Number(declaredValue) || 0;
    const cAmount = Number(codAmount) || 0;

    // 1) base by service level (digit-by-digit)
    const baseMap: Record<string, number> = {
      standard: 120, // KSh
      express: 220,
      "same-day": 400,
    };
    const base = baseMap[serviceLevel] ?? baseMap.standard;

    // 2) volumetric weight: (L*W*H)/5000 (kg)
    const volumetricKg = dims ? Math.round(((l * wi * h) / 5000) * 10) / 10 : 0; // one decimal
    const billableWeight = Math.max(w, volumetricKg);

    // 3) weight charge per kg
    const perKg = 40; // KSh per kg
    const weightChargeRaw = Math.round(billableWeight * perKg);

    // 4) zone multiplier
    const zoneMap: Record<string, number> = {
      within_city: 1.0,
      intercity: 1.35,
      national: 2.2,
      international: 6.0,
    };
    const zoneMultiplier = zoneMap[deliveryZone] ?? 1.0;

    // 5) apply multiplier to weight charge
    const weightChargeWithZone = Math.round(weightChargeRaw * zoneMultiplier);

    // 6) surcharges for special nature
    const fragileSurcharge = nature.includes("Fragile") ? 50 : 0;
    const perishableSurcharge = nature.includes("Perishable") ? 120 : 0;
    const electronicsSurcharge = nature.includes("Electronics") ? 40 : 0;
    const liquidSurcharge = nature.includes("Liquid") ? 120 : 0;

    // 7) insurance fee: 1% of declared value, minimum KSh 50 if chosen
    const insuranceFee = insurance ? Math.max(50, Math.round(dv * 0.01)) : 0;

    // 8) COD fee: 2% of COD amount, min KSh 50, if COD chosen
    const codFee = cod ? Math.max(50, Math.round(cAmount * 0.02)) : 0;

    // 9) other flat fees (handling, packaging)
    const handlingFee = packageType === "pallet" ? 300 : 60; // pallet handled separately

    // 10) sum step-by-step
    const step1 = base + weightChargeWithZone; // base + weight (zone applied)
    const step2 = step1 + handlingFee;
    const step3 = step2 + fragileSurcharge + perishableSurcharge + electronicsSurcharge + liquidSurcharge;
    const step4 = step3 + insuranceFee + codFee;
    const other = 0;
    const total = Math.round(step4 + other);

    return {
      base,
      billableWeight,
      volumetricKg,
      weightCharge: weightChargeRaw,
      weightChargeWithZone,
      zoneMultiplier,
      fragileSurcharge,
      perishableSurcharge,
      electronicsSurcharge,
      liquidSurcharge,
      insuranceFee,
      codFee,
      handlingFee,
      other,
      total,
    };
  }, [
    weightKg,
    dimL,
    dimW,
    dimH,
    deliveryZone,
    serviceLevel,
    packageType,
    nature,
    insurance,
    declaredValue,
    cod,
    codAmount,
  ]);

  /* --- nature toggle helper --- */
  function toggleNature(tag: string) {
    setNature((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  /* --- submit order (client demo) --- */
  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();

    // validation
    if (!senderName || !senderPhone || !recipientName || !recipientPhone || !pickupAddress || !dropoffAddress) {
      alert("Please complete required fields (sender, recipient, pickup and drop-off).");
      return;
    }
    if (!termsAccepted) {
      alert("Please accept terms and conditions to proceed.");
      return;
    }
    if (nature.includes("Hazardous")) {
      alert("Hazardous items require special handling. Please contact support for an arranged pickup.");
      return;
    }

    // generate tracking
    const trackingId = generateTrackingId();
    const createdAt = new Date().toISOString();
    const order: Order = {
      trackingId,
      createdAt,
      status: "Pending pickup",
      senderName,
      senderPhone,
      recipientName,
      recipientPhone,
      pickupAddress,
      dropoffAddress,
      pickupDate: pickupDate || undefined,
      deliveryZone,
      serviceLevel,
      packageType,
      nature,
      weightKg: Number(weightKg) || 0,
      dimsCm: dims,
      declaredValue: Number(declaredValue) || 0,
      insurance,
      cod,
      codAmount: cod ? Number(codAmount) || 0 : undefined,
      specialInstructions,
      costBreakdown: {
        base: costBreakdown.base,
        weightCharge: costBreakdown.weightChargeWithZone,
        zoneMultiplier: costBreakdown.zoneMultiplier,
        fragileSurcharge: costBreakdown.fragileSurcharge,
        perishableSurcharge: costBreakdown.perishableSurcharge,
        insuranceFee: costBreakdown.insuranceFee,
        codFee: costBreakdown.codFee,
        handlingFee: costBreakdown.handlingFee,
        other: costBreakdown.other,
        total: costBreakdown.total,
      },
    };

    // persist (demo): save to local orders and show summary
    setOrders((o) => [order, ...o]);
    setLastOrder(order);

    // clear booking fields (except sender maybe)
    setRecipientName("");
    setRecipientPhone("");
    setPickupAddress("");
    setDropoffAddress("");
    setPickupDate("");
    setWeightKg("");
    setDimL("");
    setDimW("");
    setDimH("");
    setDeclaredValue("");
    setInsurance(false);
    setCod(false);
    setCodAmount("");
    setNature([]);
    setSpecialInstructions("");
    setTermsAccepted(false);

    // show success — in real app, backend returns tracking and sends SMS/email
    setTimeout(() => {
      alert(`Order created. Tracking ID: ${trackingId}. Summary displayed.`);
    }, 150);
  }

  /* --- helpers for user actions --- */
  function copyToClipboard(text: string) {
    navigator.clipboard?.writeText(text).then(() => {
      alert("Copied to clipboard");
    });
  }

  function downloadJson(order: Order) {
    const blob = new Blob([JSON.stringify(order, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${order.trackingId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function printSummary() {
    if (!printableRef.current) return;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;
    printWindow.document.write("<html><head><title>Shipment Summary</title>");
    printWindow.document.write('<meta name="viewport" content="width=device-width,initial-scale=1">');
    printWindow.document.write("</head><body>");
    printWindow.document.write(printableRef.current.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  }

  /* --- mock recent statuses for demo display (read-only) --- */
  const recent = orders.slice(0, 6);

  return (
    <main className="bg-gray-50 min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <Link href="/services" className="inline-flex items-center gap-2 text-blue-700 font-medium">
          ← Back to Services
        </Link>
      </div>

      {/* BOOK & TRACK SECTION */}
      <section className="max-w-6xl mx-auto px-6 -mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking form (main) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">Place a Delivery Order</h2>
          <p className="text-sm text-gray-600 mb-4">Complete this form to create a booking. Dangerous goods (hazardous) require prior approval.</p>

          <form onSubmit={handlePlaceOrder} className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <input required value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Sender name" className="border rounded p-2" />
              <input required value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} placeholder="Sender phone" className="border rounded p-2" />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input required value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Recipient name" className="border rounded p-2" />
              <input required value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} placeholder="Recipient phone" className="border rounded p-2" />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input required value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder="Pickup address" className="border rounded p-2" />
              <input required value={dropoffAddress} onChange={(e) => setDropoffAddress(e.target.value)} placeholder="Drop-off address" className="border rounded p-2" />
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <input value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} type="datetime-local" className="border rounded p-2" />
              <select value={deliveryZone} onChange={(e) => setDeliveryZone(e.target.value)} className="border rounded p-2">
                <option value="within_city">Within city (0–20 km)</option>
                <option value="intercity">Intercity (20–200 km)</option>
                <option value="national">National (200+ km)</option>
                <option value="international">International</option>
              </select>
              <select value={serviceLevel} onChange={(e) => setServiceLevel(e.target.value)} className="border rounded p-2">
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="same-day">Same-day</option>
              </select>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <select value={packageType} onChange={(e) => setPackageType(e.target.value)} className="border rounded p-2">
                <option value="parcel">Parcel</option>
                <option value="document">Document</option>
                <option value="pallet">Pallet / Palletized</option>
                <option value="bag">Bag / Envelope</option>
              </select>

              <input value={weightKg as any} onChange={(e) => setWeightKg(Number(e.target.value) || "")} placeholder="Weight (kg)" type="number" min="0" step="0.1" className="border rounded p-2" />

              <div className="flex gap-2">
                <input value={dimL as any} onChange={(e) => setDimL(Number(e.target.value) || "")} placeholder="L cm" type="number" min="0" step="0.1" className="border rounded p-2" />
                <input value={dimW as any} onChange={(e) => setDimW(Number(e.target.value) || "")} placeholder="W cm" type="number" min="0" step="0.1" className="border rounded p-2" />
                <input value={dimH as any} onChange={(e) => setDimH(Number(e.target.value) || "")} placeholder="H cm" type="number" min="0" step="0.1" className="border rounded p-2" />
              </div>
            </div>

            <div>
              <label className="text-sm block mb-1">Nature of package (check all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {["Fragile", "Perishable", "Electronics", "Liquid", "Documents", "Other", "Hazardous"].map((t) => (
                  <label key={t} className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-md border">
                    <input
                      type="checkbox"
                      checked={nature.includes(t)}
                      onChange={() => toggleNature(t)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{t}</span>
                  </label>
                ))}
              </div>

              {nature.includes("Hazardous") && (
                <div className="mt-2 text-sm text-red-700">Hazardous items require prior approval — please contact support before booking.</div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input value={declaredValue as any} onChange={(e) => setDeclaredValue(Number(e.target.value) || "")} placeholder="Declared value (KSh)" type="number" min="0" className="border rounded p-2" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={insurance} onChange={(e) => setInsurance(e.target.checked)} className="w-4 h-4" />
                <span className="text-sm">Add Shipment Insurance (1% of declared value, minimum KSh 50)</span>
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={cod} onChange={(e) => setCod(e.target.checked)} className="w-4 h-4" />
                <span className="text-sm">Cash on Delivery (COD)</span>
              </label>

              {cod && (
                <input value={codAmount as any} onChange={(e) => setCodAmount(Number(e.target.value) || "")} placeholder="COD amount (KSh)" type="number" min="0" className="border rounded p-2" />
              )}
            </div>

            <div>
              <textarea placeholder="Special instructions (optional)" value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} className="w-full border rounded p-2" rows={3} />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="w-4 h-4" />
              <div className="text-sm text-gray-600">I confirm details are correct and accept SwiftPoint terms & liability limits.</div>
            </div>

            <div className="flex gap-2 mt-3">
              <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded-md font-semibold">Place Order</button>
              <button type="button" onClick={() => { alert(`Estimated total: ${ksh(costBreakdown.total)}`); }} className="border px-4 py-2 rounded-md">Quick Estimate</button>
            </div>
          </form>
        </div>

        {/* RIGHT: Summary + recent + calculator */}
        <aside className="bg-white p-6 rounded-xl shadow space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Live Price Preview</h3>
            <div className="mt-2 text-sm text-gray-600">
              <div>Service base: {ksh(costBreakdown.base)}</div>
              <div>Billable weight: {costBreakdown.billableWeight} kg (volumetric {costBreakdown.volumetricKg} kg)</div>
              <div>Weight charge (zone applied): {ksh(costBreakdown.weightChargeWithZone)}</div>
              <div>Handling & extras: {ksh(costBreakdown.handlingFee + costBreakdown.fragileSurcharge + costBreakdown.perishableSurcharge + (costBreakdown.electronicsSurcharge ?? 0) + (costBreakdown.liquidSurcharge ?? 0))}</div>
              <div>Insurance: {ksh(costBreakdown.insuranceFee)}</div>
              <div>COD fee: {ksh(costBreakdown.codFee)}</div>
              <div className="mt-2 text-xl font-bold">Estimated total: {ksh(costBreakdown.total)}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Recent Bookings (demo)</h3>
            {recent.length === 0 ? (
              <div className="text-sm text-gray-500 mt-2">No recent bookings yet.</div>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {recent.map((r) => (
                  <li key={r.trackingId} className="border rounded p-2">
                    <div className="flex justify-between">
                      <div><strong>{r.trackingId}</strong> — {r.recipientName}</div>
                      <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-xs text-gray-600">Status: {r.status} • {ksh(r.costBreakdown.total)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg">Support</h3>
            <div className="text-sm text-gray-600 mt-2">
              For hazardous items, heavy machinery, or bulk freight please contact our operations team at <strong>0722 250 875</strong> or support@swiftpointlogistics.co.ke
            </div>
          </div>
        </aside>
      </section>

      {/* Last placed order summary */}
      {lastOrder && (
        <section className="max-w-6xl mx-auto px-6 mt-8">
          <div ref={printableRef}>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">Order Summary</h3>
                  <div className="text-sm text-gray-600 mt-1">Tracking ID: <strong>{lastOrder.trackingId}</strong></div>
                  <div className="text-xs text-gray-500">Placed: {new Date(lastOrder.createdAt).toLocaleString()}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="text-lg font-semibold">{lastOrder.status}</div>
                </div>
              </div>

              <hr className="my-4" />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Sender</h4>
                  <div className="text-sm">{lastOrder.senderName} • {lastOrder.senderPhone}</div>
                  <div className="text-sm mt-2">{lastOrder.pickupAddress}</div>
                </div>

                <div>
                  <h4 className="font-semibold">Recipient</h4>
                  <div className="text-sm">{lastOrder.recipientName} • {lastOrder.recipientPhone}</div>
                  <div className="text-sm mt-2">{lastOrder.dropoffAddress}</div>
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Service</div>
                  <div>{lastOrder.serviceLevel} • {lastOrder.packageType}</div>
                </div>
                <div>
                  <div className="text-gray-500">Nature</div>
                  <div>{lastOrder.nature.length ? lastOrder.nature.join(", ") : "—"}</div>
                </div>
                <div>
                  <div className="text-gray-500">Declared value</div>
                  <div>{ksh(lastOrder.declaredValue)}</div>
                </div>
              </div>

              <div className="mt-4 text-sm">
                <div className="font-semibold">Cost breakdown</div>
                <ul className="mt-2 space-y-1">
                  <li>Base: {ksh(lastOrder.costBreakdown.base)}</li>
                  <li>Weight & zone charge: {ksh(lastOrder.costBreakdown.weightCharge)}</li>
                  <li>Handling & surcharges: {ksh((lastOrder.costBreakdown.handlingFee ?? 0) + (lastOrder.costBreakdown.fragileSurcharge ?? 0) + (lastOrder.costBreakdown.perishableSurcharge ?? 0) + (lastOrder.costBreakdown.electronicsSurcharge ?? 0) + (lastOrder.costBreakdown.liquidSurcharge ?? 0) + (lastOrder.costBreakdown.other ?? 0))}</li>
                  <li>Insurance: {ksh(lastOrder.costBreakdown.insuranceFee)}</li>
                  <li>COD fee: {ksh(lastOrder.costBreakdown.codFee)}</li>
                  <li className="mt-2 font-bold">Total: {ksh(lastOrder.costBreakdown.total)}</li>
                </ul>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => copyToClipboard(lastOrder.trackingId)} className="px-4 py-2 border rounded">Copy Tracking ID</button>
                <button onClick={() => downloadJson(lastOrder)} className="px-4 py-2 border rounded">Download JSON</button>
                <button onClick={printSummary} className="px-4 py-2 bg-blue-700 text-white rounded">Print Summary</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA footer */}
      <section className="py-12 max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-lg p-6 text-center shadow">
          <h3 className="text-lg font-semibold">Need enterprise support or scheduled pickups?</h3>
          <p className="text-sm text-gray-600 mt-1">Contact our operations team for SLAs, weekly pickups and corporate pricing.</p>
          <div className="mt-4">
            <Link href="/contact" className="px-6 py-2 bg-blue-700 text-white rounded-md">Contact Operations</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
