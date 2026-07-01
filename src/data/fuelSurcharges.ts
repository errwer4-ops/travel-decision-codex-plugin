import type { FuelSurcharge } from "../types/travel.js";

export const fuelSurcharges: FuelSurcharge[] = [
  { city: "osaka", airport: "KIX", airline: "Mock Air", month: "2026-08", surchargeKRW: 43000, source: "mock:user-fuel-surcharge-site", updatedAt: "2026-06-25" },
  { city: "tokyo", airport: "NRT", airline: "Mock Air", month: "2026-08", surchargeKRW: 48000, source: "mock:user-fuel-surcharge-site", updatedAt: "2026-06-25" },
  { city: "tokyo", airport: "HND", airline: "Mock Air", month: "2026-08", surchargeKRW: 48000, source: "mock:user-fuel-surcharge-site", updatedAt: "2026-06-25" },
  { city: "fukuoka", airport: "FUK", airline: "Mock Air", month: "2026-08", surchargeKRW: 39000, source: "mock:user-fuel-surcharge-site", updatedAt: "2026-06-25" }
];
