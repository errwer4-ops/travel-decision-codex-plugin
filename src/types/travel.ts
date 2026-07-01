export type TravelStyle = "budget" | "balanced" | "premium";
export type PlanType = "budget" | "balanced" | "satisfaction";
export type SupportedCity = "osaka" | "tokyo" | "fukuoka";
export type AirportCode = "ICN" | "GMP" | "PUS" | "KIX" | "NRT" | "HND" | "FUK";
export type BudgetStatus = "within_budget" | "near_limit" | "over_budget";
export type ConfidenceLabel = "낮음" | "보통" | "높음" | "매우 높음";

export interface Attraction {
  id: string;
  city: SupportedCity;
  name: string;
  aliases: string[];
  priceKRW: number;
  averageVisitHours: number;
  area: string;
}

export interface FuelSurcharge {
  city: SupportedCity;
  airport: AirportCode;
  airline: string;
  month: string;
  surchargeKRW: number;
  source: string;
  updatedAt: string;
}

export interface BookableTripInput {
  departureDate: string;
  returnDate: string;
  departureAirport: AirportCode;
  arrivalAirport: AirportCode;
  travelers: number;
  budgetKRW: number;
  mustVisitAttractions: string[];
  travelStyle?: TravelStyle;
  directFlightPreferred?: boolean;
  preferredHotelArea?: string;
}

export interface EstimateTripCostInput {
  departureDate: string;
  returnDate: string;
  departureAirport: AirportCode;
  arrivalAirport: AirportCode;
  travelers: number;
  budgetKRW: number;
  mustVisitAttractions: string[];
  travelStyle: TravelStyle;
}

export interface ExplainBookingConfidenceInput {
  totalCostKRW: number;
  budgetKRW: number;
  mustVisitCoverageRate: number;
  routeEfficiencyScore: number;
  hiddenCostIncluded: boolean;
  fuelSurchargeIncluded: boolean;
  travelStyle: TravelStyle;
}

export interface CostBreakdown {
  flights: number;
  fuelSurcharge: number;
  hotels: number;
  attractionTickets: number;
  localTransport: number;
  meals: number;
  contingency: number;
}

export interface FlightOffer {
  id: string;
  title: string;
  airline: string;
  departureAirport: AirportCode;
  arrivalAirport: AirportCode;
  direct: boolean;
  priceKRW: number;
  bookingUrl: string;
}

export interface HotelOffer {
  id: string;
  title: string;
  city: SupportedCity;
  area: string;
  rating: number;
  pricePerNightKRW: number;
  bookingUrl: string;
}

export interface ActivityOffer {
  id: string;
  title: string;
  city: SupportedCity;
  attractionName: string;
  priceKRW: number;
  bookingUrl: string;
}

export interface AttractionCost {
  name: string;
  unitPriceKRW: number;
  travelers: number;
  totalKRW: number;
}

export interface TravelPlan {
  id: string;
  name: string;
  type: PlanType;
  totalCostKRW: number;
  displayTotalCostKRW: string;
  budgetStatus: BudgetStatus;
  remainingBudgetKRW: number;
  displayRemainingBudgetKRW: string;
  bookingConfidenceScore: number;
  confidenceLabel: ConfidenceLabel;
  reasons: string[];
  risks: string[];
  costBreakdown: CostBreakdown;
  selectedFlight: FlightOffer;
  selectedHotel: HotelOffer;
  selectedActivities: ActivityOffer[];
  attractionCosts: AttractionCost[];
  bookingLinks: {
    flight: string;
    hotel: string;
    activities: string[];
  };
}

export interface PlanBookableTripOutput {
  city: string;
  nights: number;
  days: number;
  displayFormattingGuidance: string;
  plans: TravelPlan[];
}

export interface EstimateTripCostOutput {
  totalCostKRW: number;
  displayTotalCostKRW: string;
  costBreakdown: CostBreakdown;
  budgetStatus: BudgetStatus;
  remainingBudgetKRW: number;
  displayRemainingBudgetKRW: string;
  displayFormattingGuidance: string;
  hiddenCosts: {
    contingencyKRW: number;
    note: string;
  };
  fuelSurchargeSummary: {
    included: boolean;
    perTravelerKRW: number;
    totalKRW: number;
    source: string;
    updatedAt: string;
  };
}

export interface ExplainBookingConfidenceOutput {
  score: number;
  label: ConfidenceLabel;
  explanation: string;
  improvementSuggestions: string[];
}
