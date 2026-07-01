import { mockActivities, mockFlights, mockHotels } from "../data/mockProducts.js";
import type { ActivityOffer, FlightOffer, HotelOffer, PlanType, SupportedCity } from "../types/travel.js";

const planToProductSuffix: Record<PlanType, string> = {
  budget: "budget",
  balanced: "balanced",
  satisfaction: "premium"
};

export function searchFlights(city: SupportedCity, type: PlanType, directOnly: boolean): FlightOffer {
  const suffix = planToProductSuffix[type];
  const candidates = mockFlights
    .filter((flight) => flight.id.includes(city))
    .filter((flight) => flight.id.endsWith(suffix))
    .filter((flight) => !directOnly || flight.direct);

  return candidates[0] ?? mockFlights.find((flight) => flight.id.includes(city)) ?? mockFlights[0];
}

export function searchHotels(city: SupportedCity, type: PlanType, preferredArea?: string): HotelOffer {
  const suffix = planToProductSuffix[type];
  const candidates = mockHotels.filter((hotel) => hotel.city === city);

  // 플랜 등급에 맞는 호텔 우선, 선호 지역은 같은 등급 내에서만 반영
  const tierMatch = candidates.find((hotel) => hotel.id.endsWith(suffix));
  if (tierMatch) return tierMatch;

  // 등급 호텔이 없을 때만 선호 지역으로 폴백
  const areaMatch = preferredArea
    ? candidates.find((hotel) => hotel.area.includes(preferredArea))
    : undefined;

  return areaMatch ?? candidates[0];
}

export function searchActivities(city: SupportedCity, attractionNames: string[]): ActivityOffer[] {
  const normalized = attractionNames.map((name) => name.trim().toLowerCase());

  return mockActivities.filter((activity) => {
    if (activity.city !== city) return false;
    return normalized.some((name) => activity.attractionName.toLowerCase().includes(name) || name.includes(activity.attractionName.toLowerCase()));
  });
}
