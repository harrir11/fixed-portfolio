"use client";

import React, { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";

/**
 * EGG — a tiny interactive map that shows egg prices.
 *
 * Further hardening:
 *  - Removed static import of react-leaflet and now lazy-load it on the client with dynamic import
 *    to avoid SSR build issues ("Build failed with 1 error") in Next.js.
 *  - Legend remains removed per your preference. Min/Max are hardcoded in priceToColor.
 *  - Tests kept and still runnable via #run-tests hash or window.__EGG_RUN_TESTS__.
 *
 * How to use locally (one-file demo):
 * 1) Install: `npm i react-leaflet leaflet`
 * 2) Drop <EggMap /> into your app.
 */

// --------------------------------------
// Config / constants
// --------------------------------------
const MIN_PRICE = 2.5;
const MAX_PRICE = 6.0;

// Sample data — replace with your own. Prices are illustrative placeholders.
const SAMPLE_POINTS = [
  {
    id: 1,
    name: "New York City, USA",
    lat: 40.7128,
    lng: -74.006,
    priceUSD: 3.89, // per dozen
    date: "2025-08-15",
    source: "USDA (example)",
    url: "https://example.com/nyc-eggs",
  },
  {
    id: 2,
    name: "San Francisco, USA",
    lat: 37.7749,
    lng: -122.4194,
    priceUSD: 4.59,
    date: "2025-08-10",
    source: "USDA (example)",
    url: "https://example.com/sf-eggs",
  },
  {
    id: 3,
    name: "London, UK",
    lat: 51.5072,
    lng: -0.1276,
    priceUSD: 3.15,
    date: "2025-08-09",
    source: "ONS (example)",
    url: "https://example.com/london-eggs",
  },
  {
    id: 4,
    name: "Melbourne, AU",
    lat: -37.8136,
    lng: 144.9631,
    priceUSD: 4.02,
    date: "2025-08-18",
    source: "ABS (example)",
    url: "https://example.com/melbourne-eggs",
  },
  {
    id: 5,
    name: "Dublin, IE",
    lat: 53.3498,
    lng: -6.2603,
    priceUSD: 3.45,
    date: "2025-08-05",
    source: "CSO (example)",
    url: "https://example.com/dublin-eggs",
  },
  {
  id: 6,
  name: "Tokyo, JP",
  lat: 35.6762,
  lng: 139.6503,
  priceUSD: 4.75,
  date: "2025-08-12",
  source: "MAFF (example)",
  url: "https://example.com/tokyo-eggs",
},
{
  id: 7,
  name: "Paris, FR",
  lat: 48.8566,
  lng: 2.3522,
  priceUSD: 3.60,
  date: "2025-08-14",
  source: "INSEE (example)",
  url: "https://example.com/paris-eggs",
},
{
  id: 8,
  name: "Berlin, DE",
  lat: 52.52,
  lng: 13.405,
  priceUSD: 3.25,
  date: "2025-08-17",
  source: "Destatis (example)",
  url: "https://example.com/berlin-eggs",
},
{
  id: 9,
  name: "Toronto, CA",
  lat: 43.65107,
  lng: -79.347015,
  priceUSD: 4.10,
  date: "2025-08-11",
  source: "StatsCan (example)",
  url: "https://example.com/toronto-eggs",
},
{
  id: 10,
  name: "Mexico City, MX",
  lat: 19.4326,
  lng: -99.1332,
  priceUSD: 2.95,
  date: "2025-08-07",
  source: "INEGI (example)",
  url: "https://example.com/mexico-eggs",
},
{
  id: 11,
  name: "São Paulo, BR",
  lat: -23.5505,
  lng: -46.6333,
  priceUSD: 2.80,
  date: "2025-08-16",
  source: "IBGE (example)",
  url: "https://example.com/saopaulo-eggs",
},
{
  id: 12,
  name: "Cairo, EG",
  lat: 30.0444,
  lng: 31.2357,
  priceUSD: 3.05,
  date: "2025-08-08",
  source: "CAPMAS (example)",
  url: "https://example.com/cairo-eggs",
},
{
  id: 13,
  name: "Johannesburg, ZA",
  lat: -26.2041,
  lng: 28.0473,
  priceUSD: 3.70,
  date: "2025-08-13",
  source: "StatsSA (example)",
  url: "https://example.com/johannesburg-eggs",
},
{
  id: 14,
  name: "Mumbai, IN",
  lat: 19.076,
  lng: 72.8777,
  priceUSD: 2.65,
  date: "2025-08-06",
  source: "MOSPI (example)",
  url: "https://example.com/mumbai-eggs",
},
{
  id: 15,
  name: "Seoul, KR",
  lat: 37.5665,
  lng: 126.978,
  priceUSD: 4.35,
  date: "2025-08-19",
  source: "KOSIS (example)",
  url: "https://example.com/seoul-eggs",
}
];

export function dollarFormat(n) {
  return `$${n.toFixed(2)}`;
}

export function priceToColor(price) {
  // Hardcode min/max here
  const clamped = Math.max(MIN_PRICE, Math.min(MAX_PRICE, price));
  const t = (clamped - MIN_PRICE) / (MAX_PRICE - MIN_PRICE);
  const hue = 120 * (1 - t); // 120 green to 0 red
  return `hsl(${hue}, 85%, 45%)`;
}

// --------------------------------------
// Minimal UI primitives (no external UI libs)
// --------------------------------------
function Card({ children, className = "" }) {
  return <div className={`rounded-2xl shadow-xl bg-white/85 ${className}`}>{children}</div>;
}
function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
function Button({ children, onClick, className = "", type = "button" }) {
  return (
    <button type={type} onClick={onClick} className={`px-3 py-2 rounded-2xl border bg-white hover:bg-gray-50 shadow ${className}`}>
      {children}
    </button>
  );
}
function Range({ value, min, max, step, onChange }) {
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
    />
  );
}

function TopBar({ maxPrice, setMaxPrice }) {
  return (
    <div className="z-[1000] fixed top-3 left-1/2 -translate-x-1/2 w-[min(920px,90vw)]">
      <Card className="backdrop-blur border-0">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">🥚 egg</h1>
              <p className="text-sm text-gray-600 -mt-0.5">The price of eggs around the world (demo data)</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-full md:w-72">
                <label className="text-xs text-gray-700 font-medium block mb-1">
                  Max price filter: {dollarFormat(maxPrice)}
                </label>
                <Range
                  value={maxPrice}
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={0.05}
                  onChange={(v) => setMaxPrice(v)}
                />
              </div>
              <Button onClick={() => setMaxPrice(MAX_PRICE)}>
                <span aria-hidden>🔄</span> Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EggMap() {
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const isClient = typeof window !== "undefined";

  // Dynamically import react-leaflet on the client
  const [leaflet, setLeaflet] = useState(null);
  useEffect(() => {
    let mounted = true;
    if (isClient) {
      import("react-leaflet").then((mod) => {
        if (mounted) setLeaflet(mod);
      }).catch((e) => {
        // eslint-disable-next-line no-console
        console.warn("Failed to load react-leaflet dynamically:", e);
      });
    }
    return () => { mounted = false; };
  }, [isClient]);

  const points = useMemo(() => SAMPLE_POINTS.filter((p) => p.priceUSD <= maxPrice), [maxPrice]);

  const avg = useMemo(
    () => (points.length ? points.reduce((sum, p) => sum + p.priceUSD, 0) / points.length : 0),
    [points]
  );

  return (
    <div className="h-screen w-screen relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-100 via-teal-100 to-white" />

      <TopBar maxPrice={maxPrice} setMaxPrice={setMaxPrice} />

      <div className="absolute top-28 right-3 z-[1000]">
        <Card className="border-0">
          <CardContent className="p-3">
            <div className="text-xs text-gray-700">
              <div className="font-semibold">Stats</div>
              <div>Locations: {points.length}</div>
              <div>Average (shown): {avg ? dollarFormat(avg) : "—"}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map only renders when react-leaflet is loaded on the client */}
      {isClient && leaflet ? (
        <leaflet.MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} className="h-full w-full rounded-none">
          <leaflet.TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {points.map((p) => (
            <leaflet.CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={10}
              pathOptions={{ color: priceToColor(p.priceUSD), fillOpacity: 0.7, weight: 2 }}
            >
              <leaflet.Tooltip direction="top" offset={[0, -8]} opacity={1} permanent={false}>
                <div className="text-xs font-semibold">{p.name}</div>
              </leaflet.Tooltip>
              <leaflet.Popup>
                <div className="w-56">
                  {p.photo && (
                    <img src={p.photo} alt={p.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                  )}
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-700">Price: {dollarFormat(p.priceUSD)} / dozen</div>
                  <div className="text-[11px] text-gray-500">As of: {p.date}</div>
                  <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline mt-2">
                    Source ↗
                  </a>
                </div>
              </leaflet.Popup>
            </leaflet.CircleMarker>
          ))}
        </leaflet.MapContainer>
      ) : (
        <div className="h-full w-full grid place-items-center text-sm text-gray-600">
          Loading map…
        </div>
      )}

      <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[min(920px,90vw)]">
        <Card>
          <CardContent className="p-3 text-center text-xs text-gray-600">
            Demo data for portfolio purposes. Replace with real sources (gov stats, market APIs, your scraper).
          </CardContent>
        </Card>
      </footer>
    </div>
  );
}

// --------------------------------------
// Lightweight in-file test harness
// --------------------------------------
export function runEggTests() {
  const results = [];
  const assert = (name, cond) => results.push({ name, pass: !!cond });

  const low = priceToColor(MIN_PRICE);
  const mid = priceToColor((MIN_PRICE + MAX_PRICE) / 2);
  const high = priceToColor(MAX_PRICE);
  const hueNum = (hsl) => {
    const m = /hsl\((\d+(?:\.\d+)?)/.exec(hsl);
    return m ? Number(m[1]) : NaN;
  };

  assert("dollarFormat formats to two decimals", dollarFormat(3.5) === "$3.50");
  assert("dollarFormat pads zeros", dollarFormat(3) === "$3.00");
  assert("priceToColor low closer to green (hue ~120)", hueNum(low) > 80);
  assert("priceToColor mid between green and red", hueNum(mid) > 20 && hueNum(mid) < 100);
  assert("priceToColor high closer to red (hue ~0)", hueNum(high) < 40);

  const hue = (p) => hueNum(priceToColor(p));
  assert("monotonic mapping 3.0 < 5.0", hue(3.0) > hue(5.0));

  const filtered = SAMPLE_POINTS.filter((p) => p.priceUSD <= 4.0);
  assert("filtering by price <= 4 keeps some points", filtered.length > 0);
  assert("all filtered prices <= 4", filtered.every((p) => p.priceUSD <= 4.0));

  assert("clamps below MIN_PRICE", priceToColor(0) === priceToColor(MIN_PRICE));
  assert("clamps above MAX_PRICE", priceToColor(999) === priceToColor(MAX_PRICE));

  return results;
}

if (typeof window !== "undefined") {
  try {
    const shouldRun = window.__EGG_RUN_TESTS__ === true || (typeof window.location?.hash === "string" && window.location.hash.includes("run-tests"));
    if (shouldRun) {
      const results = runEggTests();
      const summary = `${results.filter((r) => r.pass).length}/${results.length} tests passed`;
      // eslint-disable-next-line no-console
      console.log("EGG test results:", results, summary);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("EGG tests failed to execute:", e);
  }
}
