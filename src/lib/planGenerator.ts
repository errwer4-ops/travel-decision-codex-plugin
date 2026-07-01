import { cityNames, getCityByRoute } from "../data/cityMapping.js";
import type {
  BookableTripInput,
  PlanBookableTripOutput,
  PlanType,
  TravelPlan,
  TravelStyle
} from "../types/travel.js";
import { calculateDates } from "./calculateDates.js";
import {
  calculateAttractionCosts,
  calculateCostBreakdown,
  getFuelSurcharge,
  resolveAttractions,
  sumBreakdown
} from "./calculateCosts.js";
import { calculateBookingConfidence, getBudgetStatus } from "./confidenceScore.js";
import { validateTripInput } from "./validators.js";
import { searchActivities, searchFlights, searchHotels } from "../services/myrealtrip.js";

const planTypes: PlanType[] = ["budget", "balanced", "satisfaction"];

const planNames: Record<PlanType, string> = {
  budget: "가성비형",
  balanced: "균형형",
  satisfaction: "만족도 우선형"
};

export const displayFormattingGuidance =
  "Markdown formatting: do not use the tilde character (~) before approximate prices because some clients render paired tildes as strikethrough. Use '약 103만원' or '1,030,000원' instead.";

function styleForPlan(type: PlanType): TravelStyle {
  if (type === "satisfaction") return "premium";
  return type;
}

function routeEfficiencyScore(type: PlanType, mustVisitCount: number): number {
  const base = type === "satisfaction" ? 88 : type === "balanced" ? 80 : 72;
  return Math.max(45, Math.min(100, base - Math.max(0, mustVisitCount - 2) * 4));
}

function formatApproxKRW(value: number): string {
  const roundedManwon = Math.round(Math.abs(value) / 10000);
  const prefix = value < 0 ? "-약 " : "약 ";
  return `${prefix}${roundedManwon.toLocaleString("ko-KR")}만원`;
}

export function planBookableTrip(input: BookableTripInput): PlanBookableTripOutput {
  validateTripInput(input);

  const city = getCityByRoute(input.departureAirport, input.arrivalAirport);
  if (!city) throw new Error("Unsupported route.");

  const { nights, days } = calculateDates(input.departureDate, input.returnDate);
  const resolvedAttractions = resolveAttractions(city, input.mustVisitAttractions);
  const mustVisitCoverageRate =
    input.mustVisitAttractions.length === 0 ? 1 : resolvedAttractions.length / input.mustVisitAttractions.length;

  const plans: TravelPlan[] = planTypes.map((type) => {
    const flight = searchFlights(city, type, input.directFlightPreferred ?? false);
    const hotel = searchHotels(city, type, input.preferredHotelArea);
    const activities = searchActivities(city, resolvedAttractions.map((attraction) => attraction.name));
    const costBreakdown = calculateCostBreakdown({ input, type, flight, hotel });
    const totalCostKRW = sumBreakdown(costBreakdown);
    const remainingBudgetKRW = input.budgetKRW - totalCostKRW;
    const confidence = calculateBookingConfidence({
      totalCostKRW,
      budgetKRW: input.budgetKRW,
      mustVisitCoverageRate,
      routeEfficiencyScore: routeEfficiencyScore(type, resolvedAttractions.length),
      hiddenCostIncluded: true,
      fuelSurchargeIncluded: true,
      travelStyle: styleForPlan(type)
    });
    const budgetStatus = getBudgetStatus(totalCostKRW, input.budgetKRW);

    return {
      id: `${city}-${type}`,
      name: `${planNames[type]} 추천 플랜`,
      type,
      totalCostKRW,
      displayTotalCostKRW: formatApproxKRW(totalCostKRW),
      budgetStatus,
      remainingBudgetKRW,
      displayRemainingBudgetKRW: formatApproxKRW(remainingBudgetKRW),
      bookingConfidenceScore: confidence.score,
      confidenceLabel: confidence.label,
      reasons: buildReasons({
        type,
        totalCostKRW,
        budgetKRW: input.budgetKRW,
        coverage: mustVisitCoverageRate,
        hotelArea: hotel.area,
        fuelSurchargeKRW: getFuelSurcharge(input).surchargeKRW
      }),
      risks: buildRisks(totalCostKRW, input.budgetKRW, mustVisitCoverageRate),
      costBreakdown,
      selectedFlight: flight,
      selectedHotel: hotel,
      selectedActivities: activities,
      attractionCosts: calculateAttractionCosts(city, input.mustVisitAttractions, input.travelers),
      bookingLinks: {
        flight: flight.bookingUrl,
        hotel: hotel.bookingUrl,
        activities: activities.map((activity) => activity.bookingUrl)
      }
    };
  });

  return {
    city: cityNames[city],
    nights,
    days,
    displayFormattingGuidance,
    plans
  };
}

function buildReasons({
  type,
  totalCostKRW,
  budgetKRW,
  coverage,
  hotelArea,
  fuelSurchargeKRW
}: {
  type: PlanType;
  totalCostKRW: number;
  budgetKRW: number;
  coverage: number;
  hotelArea: string;
  fuelSurchargeKRW: number;
}): string[] {
  const reasons = [
    totalCostKRW <= budgetKRW ? "예산 안에서 예약 가능한 조합입니다." : "초과 금액과 조정 포인트가 명확합니다.",
    coverage >= 1 ? "필수 관광지를 모두 비용과 일정에 반영했습니다." : "일부 필수 관광지는 대체 일정 검토가 필요합니다.",
    `${hotelArea} 숙소를 기준으로 동선 효율을 계산했습니다.`,
    `유류할증료 ${fuelSurchargeKRW.toLocaleString("ko-KR")}원/인을 반영했습니다.`
  ];

  if (type === "budget") reasons.push("가격 민감도가 높은 사용자를 위해 항공권과 숙소 비용을 낮춘 조합입니다.");
  if (type === "balanced") reasons.push("비용과 만족도의 균형을 우선해 해커톤 MVP의 기본 추천으로 적합합니다.");
  if (type === "satisfaction") reasons.push("숙소 만족도와 편의성을 높여 예약 후 후회 가능성을 낮추는 조합입니다.");

  return reasons;
}

function buildRisks(totalCostKRW: number, budgetKRW: number, coverage: number): string[] {
  const risks: string[] = [];

  if (totalCostKRW > budgetKRW) {
    risks.push(`현재 플랜은 예산보다 ${(totalCostKRW - budgetKRW).toLocaleString("ko-KR")}원 초과됩니다.`);
    risks.push("숙소 변경, 항공편 변경, 액티비티 조정 중 하나를 선택하면 예산 내 여행 가능성이 높아집니다.");
  }

  if (coverage < 1) {
    risks.push("필수 관광지 일부가 mock 데이터에 매칭되지 않아 실제 API 연동 시 보강이 필요합니다.");
  }

  risks.push("현재 결과는 mock 데이터 기반이며 실제 MyRealTrip API 가격과 재고로 교체할 수 있는 구조입니다.");

  return risks;
}
