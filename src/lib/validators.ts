import { getCityByRoute } from "../data/cityMapping.js";
import type { AirportCode, BookableTripInput, EstimateTripCostInput } from "../types/travel.js";
import { calculateDates } from "./calculateDates.js";

const airportCodes = new Set(["ICN", "GMP", "PUS", "KIX", "NRT", "HND", "FUK"]);

export function assertAirportCode(value: string, field: string): asserts value is AirportCode {
  if (!airportCodes.has(value)) {
    throw new Error(`${field} must be one of ICN, GMP, PUS, KIX, NRT, HND, FUK.`);
  }
}

export function validateTripInput(input: BookableTripInput | EstimateTripCostInput): void {
  if (!input.departureDate || !input.returnDate) {
    throw new Error("departureDate and returnDate are required.");
  }

  assertAirportCode(input.departureAirport, "departureAirport");
  assertAirportCode(input.arrivalAirport, "arrivalAirport");

  const { nights } = calculateDates(input.departureDate, input.returnDate);
  if (nights < 1) {
    throw new Error("returnDate must be after departureDate.");
  }

  if (!Number.isFinite(input.travelers) || input.travelers < 1) {
    throw new Error("travelers must be at least 1.");
  }

  if (!Number.isFinite(input.budgetKRW) || input.budgetKRW < 1) {
    throw new Error("budgetKRW must be a positive number.");
  }

  if (input.travelStyle !== undefined && !["budget", "balanced", "premium"].includes(input.travelStyle)) {
    throw new Error("travelStyle must be budget, balanced, or premium.");
  }

  if (!getCityByRoute(input.departureAirport, input.arrivalAirport)) {
    throw new Error("Unsupported route. MVP supports ICN-KIX, PUS-KIX, ICN-NRT, ICN-HND, GMP-HND, ICN-FUK, PUS-FUK.");
  }
}
