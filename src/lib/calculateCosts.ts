import { attractions } from "../data/attractions.js";
import { fuelSurcharges } from "../data/fuelSurcharges.js";
import { cityNames, getCityByRoute } from "../data/cityMapping.js";
import type {
  Attraction,
  AttractionCost,
  BookableTripInput,
  CostBreakdown,
  EstimateTripCostInput,
  EstimateTripCostOutput,
  FlightOffer,
  HotelOffer,
  PlanType,
  SupportedCity
} from "../types/travel.js";
import { calculateDates, calculateRooms } from "./calculateDates.js";
import { getBudgetStatus } from "./confidenceScore.js";
import { validateTripInput } from "./validators.js";

const localTransportByCity: Record<SupportedCity, number> = {
  osaka: 12000,
  tokyo: 15000,
  fukuoka: 10000
};

const mealsByPlan: Record<PlanType, number> = {
  budget: 30000,
  balanced: 50000,
  satisfaction: 100000
};

const displayFormattingGuidance =
  "Markdown formatting: do not use the tilde character (~) before approximate prices because some clients render paired tildes as strikethrough. Use '약 103만원' or '1,030,000원' instead.";

function roundKRW(value: number): number {
  return Math.round(value / 1000) * 1000;
}

function formatApproxKRW(value: number): string {
  const roundedManwon = Math.round(Math.abs(value) / 10000);
  const prefix = value < 0 ? "-약 " : "약 ";
  return `${prefix}${roundedManwon.toLocaleString("ko-KR")}만원`;
}

export function resolveAttractions(city: SupportedCity, names: string[]): Attraction[] {
  const cityAttractions = attractions.filter((attraction) => attraction.city === city);
  const resolved: Attraction[] = [];

  names.forEach((name, index) => {
    const inputName = name.trim().toLowerCase();
    const matched = cityAttractions.find((attraction) => {
      const candidates = [attraction.name, attraction.id, ...attraction.aliases].map((candidate) => candidate.toLowerCase());
      return candidates.some((candidate) => candidate.includes(inputName) || inputName.includes(candidate));
    });
    const selected = matched ?? cityAttractions[index];

    if (selected && !resolved.some((attraction) => attraction.id === selected.id)) {
      resolved.push(selected);
    }
  });

  return resolved;
}

export function calculateAttractionCosts(city: SupportedCity, names: string[], travelers: number): AttractionCost[] {
  return resolveAttractions(city, names).map((attraction) => ({
    name: attraction.name,
    unitPriceKRW: attraction.priceKRW,
    travelers,
    totalKRW: attraction.priceKRW * travelers
  }));
}

export function getFuelSurcharge(input: BookableTripInput | EstimateTripCostInput) {
  const city = getCityByRoute(input.departureAirport, input.arrivalAirport);
  const month = input.departureDate.slice(0, 7);
  const fallback = {
    city: city ?? "osaka",
    airport: input.arrivalAirport,
    airline: "Mock Air",
    month,
    surchargeKRW: 0,
    source: "mock:user-fuel-surcharge-site",
    updatedAt: "2026-06-25"
  };

  if (!city) return fallback;

  return (
    fuelSurcharges.find((item) => item.city === city && item.airport === input.arrivalAirport && item.month === month) ??
    fuelSurcharges.find((item) => item.city === city && item.airport === input.arrivalAirport) ??
    fuelSurcharges.find((item) => item.city === city) ??
    fallback
  );
}

export function calculateCostBreakdown({
  input,
  type,
  flight,
  hotel
}: {
  input: BookableTripInput | EstimateTripCostInput;
  type: PlanType;
  flight: FlightOffer;
  hotel: HotelOffer;
}): CostBreakdown {
  const city = getCityByRoute(input.departureAirport, input.arrivalAirport);
  if (!city) throw new Error("Unsupported route.");

  const { nights, days } = calculateDates(input.departureDate, input.returnDate);
  const rooms = calculateRooms(input.travelers);
  const attractionCosts = calculateAttractionCosts(city, input.mustVisitAttractions, input.travelers);
  const attractionTickets = attractionCosts.reduce((sum, item) => sum + item.totalKRW, 0);
  const fuelSurchargeKRW = getFuelSurcharge(input).surchargeKRW * input.travelers;
  const subtotalWithoutContingency =
    flight.priceKRW * input.travelers +
    fuelSurchargeKRW +
    hotel.pricePerNightKRW * nights * rooms +
    attractionTickets +
    localTransportByCity[city] * days * input.travelers +
    mealsByPlan[type] * days * input.travelers;

  return {
    flights: flight.priceKRW * input.travelers,
    fuelSurcharge: fuelSurchargeKRW,
    hotels: hotel.pricePerNightKRW * nights * rooms,
    attractionTickets,
    localTransport: localTransportByCity[city] * days * input.travelers,
    meals: mealsByPlan[type] * days * input.travelers,
    contingency: roundKRW(subtotalWithoutContingency * 0.05)
  };
}

export function sumBreakdown(breakdown: CostBreakdown): number {
  return Object.values(breakdown).reduce((sum, value) => sum + value, 0);
}

export function estimateTripCost(input: EstimateTripCostInput): EstimateTripCostOutput {
  validateTripInput(input);

  const city = getCityByRoute(input.departureAirport, input.arrivalAirport);
  if (!city) throw new Error("Unsupported route.");

  const type: PlanType = input.travelStyle === "premium" ? "satisfaction" : input.travelStyle;
  const baseFlight = {
    id: `estimate-${city}-flight`,
    title: `${cityNames[city]} estimate flight`,
    airline: "Mock Air",
    departureAirport: input.departureAirport,
    arrivalAirport: input.arrivalAirport,
    direct: true,
    priceKRW: city === "osaka" ? 320000 : city === "tokyo" ? 380000 : 260000,
    bookingUrl: "https://www.myrealtrip.com"
  };
  const baseHotel = {
    id: `estimate-${city}-hotel`,
    title: `${cityNames[city]} estimate hotel`,
    city,
    area: "중심가",
    rating: 4.3,
    pricePerNightKRW: city === "osaka" ? 90000 : city === "tokyo" ? 120000 : 80000,
    bookingUrl: "https://www.myrealtrip.com"
  };
  const breakdown = calculateCostBreakdown({ input, type, flight: baseFlight, hotel: baseHotel });
  const totalCostKRW = sumBreakdown(breakdown);
  const fuel = getFuelSurcharge(input);
  const remainingBudgetKRW = input.budgetKRW - totalCostKRW;

  return {
    totalCostKRW,
    displayTotalCostKRW: formatApproxKRW(totalCostKRW),
    costBreakdown: breakdown,
    budgetStatus: getBudgetStatus(totalCostKRW, input.budgetKRW),
    remainingBudgetKRW,
    displayRemainingBudgetKRW: formatApproxKRW(remainingBudgetKRW),
    displayFormattingGuidance,
    hiddenCosts: {
      contingencyKRW: breakdown.contingency,
      note: "식비, 현지 교통비, 예비비를 숨은 비용으로 반영했습니다."
    },
    fuelSurchargeSummary: {
      included: true,
      perTravelerKRW: fuel.surchargeKRW,
      totalKRW: fuel.surchargeKRW * input.travelers,
      source: fuel.source,
      updatedAt: fuel.updatedAt
    }
  };
}
