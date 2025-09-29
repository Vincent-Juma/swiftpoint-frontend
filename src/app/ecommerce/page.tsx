"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

export default function Ecommerce() {
  /* ===== Estimator States ===== */
  const [orders, setOrders] = useState<number>(100);
  const [averageWeight, setAverageWeight] = useState<number>(2);
  const [cod, setCod] = useState<boolean>(false);

  /* ===== Add-on & Plan States ===== */
  const [packaging, setPackaging] = useState<"none" | "standard" | "branded" | "eco">("none");
  const [storageMonths, setStorageMonths] = useState<number>(0);
  const [storageVolume, setStorageVolume] = useState<number>(1); // cubic meters
  const [insurance, setInsurance] = useState<boolean>(false);
  const [express, setExpress] = useState<boolean>(false);

  const [plan, setPlan] = useState<"payg" | "starter" | "growth" | "enterprise">("payg");
  const [referralCode, setReferralCode] = useState<string>("");

  /* ===== Pricing constants ===== */
  const baseRate = 200; // KSh per order base
  const weightFactor = 50; // per kg above 1kg

  /* ===== Derived costs ===== */
  const costBreakdown = useMemo(() => {
    // Delivery core
    const deliveryPerOrder = baseRate + Math.max(0, averageWeight - 1) * weightFactor;
    const deliveryCost = orders * deliveryPerOrder;

    // Packaging
    const packagingRate = packaging === "standard" ? 20 : packaging === "branded" ? 50 : packaging === "eco" ? 35 : 0;
    const packagingCost = orders * packagingRate;

    // Storage: simple model: KSh 500 per m3 per month
    const storageCost = storageMonths * storageVolume * 500;

    // Insurance & Express
    const insuranceCost = insurance ? orders * 15 : 0;
    const expressCost = express ? orders * 120 : 0;

    const addonsCost = packagingCost + storageCost + insuranceCost + expressCost;

    // COD handling
    const codFeePct = cod ? 0.015 : 0; // 1.5%
    const codHandling = (deliveryCost + addonsCost) * codFeePct;

    // Pay-as-you-go total (default)
    const paygTotal = deliveryCost + addonsCost + codHandling;

    // Subscription plans (flat fee + extra order charges + discounts on addons)
    const plans = {
      starter: {
        flatFee: 30000,
        includedOrders: 200,
        extraPerOrder: 100,
        addonDiscount: 0.1,
      },
      growth: {
        flatFee: 60000,
        includedOrders: 600,
        extraPerOrder: 90,
        addonDiscount: 0.15,
      },
      enterprise: {
        flatFee: 150000,
        includedOrders: 2000,
        extraPerOrder: 70,
        addonDiscount: 0.25,
      },
    } as const;

    const selectedPlan = plan;

    let planTotal = paygTotal;
    if (selectedPlan !== "payg") {
      const p = plans[selectedPlan as keyof typeof plans];
      const extraOrders = Math.max(0, orders - p.includedOrders);
      const extraCharge = extraOrders * p.extraPerOrder;
      const discountedAddons = addonsCost * (1 - p.addonDiscount);
      // We keep COD handling as-is (percentage on the original delivery + addons) because COD is a bank/collection cost
      planTotal = p.flatFee + extraCharge + discountedAddons + codHandling;
    }

    // Potential savings compared to payg
    const savings = paygTotal - planTotal;

    return {
      deliveryPerOrder,
      deliveryCost,
      packagingCost,
      storageCost,
      insuranceCost,
      expressCost,
      addonsCost,
      codHandling,
      paygTotal,
      planTotal,
      savings,
    };
  }, [orders, averageWeight, cod, packaging, storageMonths, storageVolume, insurance, express, plan]);

  /* ===== Handlers ===== */
  const handleOrders = (e: React.ChangeEvent<HTMLInputElement>) => setOrders(Number(e.target.value) || 0);
  const handleWeight = (e: React.ChangeEvent<HTMLInputElement>) => setAverageWeight(Number(e.target.value) || 0);

  const generateReferral = async () => {
    if (!referralCode) {
      const code = `SWIFT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      setReferralCode(code);
      try {
        await navigator.clipboard.writeText(`${location.origin}/ecommerce/signup?ref=${code}`);
        alert("Referral link copied to clipboard: " + `${location.origin}/ecommerce/signup?ref=${code}`);
      } catch (err) {
        // silent fallback
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${location.origin}/ecommerce/signup?ref=${referralCode}`);
        alert("Referral link copied to clipboard: " + `${location.origin}/ecommerce/signup?ref=${referralCode}`);
      } catch (err) {
        // silent fallback
      }
    }
  };

  /* ===== Generate a simple audit report (downloadable text file) ===== */
  const generateAuditReport = () => {
    // This simulates a small paid audit that is instantly generated client-side.
    // In production you would take payment and generate a PDF server-side.
    const chargeConfirmed = confirm("Generate detailed fulfilment audit for KSh 1,000? Click OK to proceed.");
    if (!chargeConfirmed) return;

    const now = new Date();
    const filename = `swiftpoint-audit-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.txt`;

    const report = [] as string[];
    report.push("SwiftPoint Logistics — Detailed Fulfilment Audit\n");
    report.push(`Date: ${now.toISOString()}\n`);
    report.push("--- INPUTS ---\n");
    report.push(`Monthly Orders: ${orders}\n`);
    report.push(`Avg Parcel Weight: ${averageWeight} kg\n`);
    report.push(`COD Enabled: ${cod ? "Yes" : "No"}\n`);
    report.push(`Packaging: ${packaging}\n`);
    report.push(`Storage Months: ${storageMonths} / Volume: ${storageVolume} m3\n`);
    report.push(`Insurance: ${insurance ? "Yes" : "No"}\n`);
    report.push(`Express Delivery: ${express ? "Yes" : "No"}\n`);
    report.push(`Selected Plan: ${plan}\n\n`);

    report.push("--- COST BREAKDOWN (KSh) ---\n");
    report.push(`Delivery per order: ${costBreakdown.deliveryPerOrder.toFixed(2)}\n`);
    report.push(`Delivery cost: ${costBreakdown.deliveryCost.toFixed(2)}\n`);
    report.push(`Packaging cost: ${costBreakdown.packagingCost.toFixed(2)}\n`);
    report.push(`Storage cost: ${costBreakdown.storageCost.toFixed(2)}\n`);
    report.push(`Insurance cost: ${costBreakdown.insuranceCost.toFixed(2)}\n`);
    report.push(`Express cost: ${costBreakdown.expressCost.toFixed(2)}\n`);
    report.push(`COD handling: ${costBreakdown.codHandling.toFixed(2)}\n`);
    report.push(`Estimated total (payg): ${costBreakdown.paygTotal.toFixed(2)}\n`);
    report.push(`Estimated total (selected plan): ${costBreakdown.planTotal.toFixed(2)}\n`);
    report.push(`Potential savings if using selected plan: ${costBreakdown.savings.toFixed(2)}\n\n`);

    report.push("--- QUICK RECOMMENDATIONS ---\n");
    if (costBreakdown.savings > 0) {
      report.push(`You save approx KSh ${Math.round(costBreakdown.savings)} by using the selected subscription plan.\n`);
    } else {
      report.push("Subscription is not cheaper than pay-as-you-go for the inputs provided. Consider increasing order volume or switching plans.\n");
    }
    report.push("Consider branded packaging if customer retention is a priority; consider express service only for premium SKUs.\n");

    const blob = new Blob([report.join("")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    alert("Audit generated and downloaded. (In production this would be a paid PDF delivered after payment.)");
  };

  /* ===== Sample small KPI numbers for investor appeal (these would be dynamic in real product) ===== */
  const sampleKPIs = useMemo(() => {
    const monthlySellers = 120; // sample
    const avgOrderPerSeller = Math.max(1, Math.round(orders / Math.max(1, monthlySellers)));
    const avgFulfilmentMargin = 0.18; // 18% sample
    return { monthlySellers, avgOrderPerSeller, avgFulfilmentMargin };
  }, [orders]);

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* === HERO === */}
      <section className="bg-blue-700 text-white py-20 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold">SwiftPoint Logistics for E-Commerce</h1>
          <p className="mt-4 text-lg text-blue-100">Affordable, fast and reliable last-mile delivery and fulfilment for online sellers across Kenya — now built for growth and investor-ready.</p>
          <div className="mt-6">
            <Link href="#estimator" className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition">Try Cost Estimator ↓</Link>
          </div>
        </div>
      </section>

      {/* === COST ESTIMATOR === */}
      <section id="estimator" className="py-12 bg-white shadow-inner border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Fulfilment Cost Estimator</h2>
          <p className="mt-3 text-gray-600">Get a quick idea of delivery & fulfilment expenses for your orders. Toggle add-ons and subscription plans to see savings.</p>

          <div className="mt-8 bg-gray-50 p-6 rounded-2xl shadow-md text-left">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block font-medium text-gray-700">Monthly Orders</label>
                <input type="number" value={orders} onChange={handleOrders} className="mt-2 w-full border rounded-lg p-3" min={0} />
              </div>

              <div>
                <label className="block font-medium text-gray-700">Avg. Parcel Weight (kg)</label>
                <input type="number" value={averageWeight} onChange={handleWeight} className="mt-2 w-full border rounded-lg p-3" min={0} step={0.1} />
              </div>

              <div className="flex items-center mt-6">
                <input type="checkbox" checked={cod} onChange={(e) => setCod(e.target.checked)} className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                <span className="ml-3 text-gray-700 font-medium">Include COD Service</span>
              </div>
            </div>

            {/* Add-ons */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <label className="block font-medium text-gray-700">Packaging</label>
                <select value={packaging} onChange={(e) => setPackaging(e.target.value as any)} className="mt-2 w-full border rounded-lg p-2">
                  <option value="none">None (merchant packs)</option>
                  <option value="standard">Standard - KSh 20 / order</option>
                  <option value="eco">Eco - KSh 35 / order</option>
                  <option value="branded">Branded - KSh 50 / order</option>
                </select>

                <div className="mt-4">
                  <label className="block font-medium text-gray-700">Storage (months)</label>
                  <div className="flex gap-2 mt-2">
                    <input type="number" value={storageMonths} onChange={(e) => setStorageMonths(Number(e.target.value) || 0)} className="w-28 border rounded-lg p-2" min={0} />
                    <input type="number" value={storageVolume} onChange={(e) => setStorageVolume(Number(e.target.value) || 1)} className="w-28 border rounded-lg p-2" min={0.1} step={0.1} />
                    <span className="self-center text-gray-600">m³</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <label className="block font-medium text-gray-700">Other Add-ons</label>
                <div className="mt-2 flex items-center gap-3">
                  <input id="insurance" type="checkbox" checked={insurance} onChange={(e) => setInsurance(e.target.checked)} className="w-5 h-5" />
                  <label htmlFor="insurance" className="text-gray-700">Add Insurance (KSh 15 / order)</label>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <input id="express" type="checkbox" checked={express} onChange={(e) => setExpress(e.target.checked)} className="w-5 h-5" />
                  <label htmlFor="express" className="text-gray-700">Express Delivery (KSh 120 / order)</label>
                </div>

                <div className="mt-4">
                  <label className="block font-medium text-gray-700">Subscription Plan</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button onClick={() => setPlan("payg")} className={`p-2 rounded-lg border ${plan === "payg" ? "ring-2 ring-blue-500" : ""}`}>Pay-as-you-go</button>
                    <button onClick={() => setPlan("starter")} className={`p-2 rounded-lg border ${plan === "starter" ? "ring-2 ring-blue-500" : ""}`}>Starter</button>
                    <button onClick={() => setPlan("growth")} className={`p-2 rounded-lg border ${plan === "growth" ? "ring-2 ring-blue-500" : ""}`}>Growth</button>
                    <button onClick={() => setPlan("enterprise")} className={`p-2 rounded-lg border ${plan === "enterprise" ? "ring-2 ring-blue-500" : ""}`}>Enterprise</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div className="mt-6 p-6 bg-white rounded-xl shadow text-center">
              <h3 className="text-lg font-semibold text-gray-700">Estimated Monthly Cost</h3>
              <p className="text-3xl font-bold text-blue-700 mt-2">KSh {Math.round(costBreakdown.planTotal).toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">(Based on selected plan & add-ons)</p>

              <div className="mt-4 grid md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">Pay-as-you-go</div>
                  <div className="font-semibold">KSh {Math.round(costBreakdown.paygTotal).toLocaleString()}</div>
                </div>

                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">Selected Plan</div>
                  <div className="font-semibold">{plan.toUpperCase()}</div>
                </div>

                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">Estimated Savings</div>
                  <div className={`font-semibold ${costBreakdown.savings > 0 ? "text-green-600" : "text-red-600"}`}>KSh {Math.round(costBreakdown.savings).toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-col md:flex-row gap-3 justify-center">
                <Link href="/ecommerce/partner" className="inline-block bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:opacity-90">Get Started</Link>
                <button onClick={generateAuditReport} className="inline-block bg-white border border-blue-700 text-blue-700 px-5 py-2 rounded-lg font-semibold shadow hover:bg-gray-50">Generate Detailed Audit (KSh 1,000)</button>
              </div>
            </div>

            {/* Micro ad placement */}
            <div className="mt-4 p-4 border rounded-lg flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Partner Offer</div>
                <div className="font-semibold">InsureLogix — Logistics Insurance for e-commerce sellers</div>
                <div className="text-sm text-gray-600">Special rates for SwiftPoint partners.</div>
              </div>
              <div>
                <a href="#" className="text-blue-700 font-semibold">Learn more →</a>
              </div>
            </div>

            {/* Referral */}
            <div className="mt-4 p-4 bg-blue-50 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">Earn with SwiftPoint</div>
                <div className="text-sm text-gray-600">Refer a seller and earn discounts or commission.</div>
              </div>
              <div className="mt-3 md:mt-0 flex gap-3">
                <button onClick={generateReferral} className="px-4 py-2 bg-white border rounded">Create & Copy Referral Link</button>
                {referralCode && (
                  <a className="px-4 py-2 bg-blue-700 text-white rounded" href={`/ecommerce/signup?ref=${referralCode}`}>Preview Signup</a>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* === INVESTOR APPEAL & KPIs === */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800">Investor Snapshot</h2>
          <p className="mt-2 text-gray-600">Key metrics and unit economics that make SwiftPoint an attractive logistics play.</p>

          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Monthly Sellers</div>
              <div className="text-2xl font-bold">{sampleKPIs.monthlySellers}</div>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Avg Orders / Seller</div>
              <div className="text-2xl font-bold">{sampleKPIs.avgOrderPerSeller}</div>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Avg Fulfilment Margin</div>
              <div className="text-2xl font-bold">{Math.round(sampleKPIs.avgFulfilmentMargin * 100)}%</div>
            </div>
          </div>

          <div className="mt-6 p-6 border rounded-lg bg-gradient-to-r from-white to-blue-50">
            <h3 className="font-semibold text-gray-800">Why invest in our fulfilment product?</h3>
            <ul className="mt-3 text-gray-700 list-disc list-inside space-y-2">
              <li>Recurring revenue from subscription plans and storage fees.</li>
              <li>Upsell opportunities (packaging, insurance, express, data reports).</li>
              <li>Low CAC due to referral program and partner placements.</li>
              <li>Data monetization potential — anonymized logistics insights for marketplaces.</li>
            </ul>
            <div className="mt-4">
              <Link href="/ecommerce/investor" className="inline-block bg-blue-700 text-white px-5 py-2 rounded font-semibold">See Investor Deck</Link>
            </div>
          </div>
        </div>
      </section>

      {/* === CALL-TO-ACTION === */}
      <section className="py-16 bg-blue-700 text-white text-center">
        <h2 className="text-3xl font-bold">Ready to Optimise Your Delivery?</h2>
        <p className="mt-3 text-blue-100">Partner with SwiftPoint and lower your logistics costs while improving customer experience.</p>
        <div className="mt-6">
          <Link href="/ecommerce/partner" className="inline-block bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition">Get Started</Link>
        </div>
      </section>
    </main>
  );
}
