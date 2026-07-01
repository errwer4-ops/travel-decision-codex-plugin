import type { AirportCode, SupportedCity } from "../types/travel.js";

export const cityNames: Record<SupportedCity, string> = {
  osaka: "오사카",
  tokyo: "도쿄",
  fukuoka: "후쿠오카"
};

const routeToCity: Record<string, SupportedCity> = {
  "ICN-KIX": "osaka",
  "PUS-KIX": "osaka",
  "ICN-NRT": "tokyo",
  "ICN-HND": "tokyo",
  "GMP-HND": "tokyo",
  "ICN-FUK": "fukuoka",
  "PUS-FUK": "fukuoka"
};

export function getCityByRoute(departureAirport: AirportCode, arrivalAirport: AirportCode): SupportedCity | null {
  return routeToCity[`${departureAirport}-${arrivalAirport}`] ?? null;
}
