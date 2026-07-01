import type {
  BudgetStatus,
  ConfidenceLabel,
  ExplainBookingConfidenceInput,
  ExplainBookingConfidenceOutput,
  TravelStyle
} from "../types/travel.js";

export function getBudgetStatus(totalCostKRW: number, budgetKRW: number): BudgetStatus {
  const ratio = totalCostKRW / budgetKRW;
  if (ratio <= 0.9) return "within_budget";
  if (ratio <= 1) return "near_limit";
  return "over_budget";
}

export function getConfidenceLabel(score: number): ConfidenceLabel {
  if (score >= 85) return "매우 높음";
  if (score >= 70) return "높음";
  if (score >= 50) return "보통";
  return "낮음";
}

function budgetFitScore(totalCostKRW: number, budgetKRW: number): number {
  const ratio = totalCostKRW / budgetKRW;
  if (ratio <= 0.9) return 40;
  if (ratio <= 1) return 34;
  if (ratio <= 1.1) return 22;
  return 10;
}

function styleFitScore(style: TravelStyle): number {
  if (style === "balanced") return 5;
  if (style === "budget") return 4;
  return 3;
}

export function calculateBookingConfidence(input: ExplainBookingConfidenceInput): ExplainBookingConfidenceOutput {
  const normalizedCoverage = Math.max(0, Math.min(1, input.mustVisitCoverageRate));
  const normalizedRoute = Math.max(0, Math.min(1, input.routeEfficiencyScore / 100));
  const score = Math.round(
    budgetFitScore(input.totalCostKRW, input.budgetKRW) +
      normalizedCoverage * 20 +
      (input.hiddenCostIncluded ? 15 : 0) +
      (input.fuelSurchargeIncluded ? 10 : 0) +
      normalizedRoute * 10 +
      styleFitScore(input.travelStyle)
  );
  const label = getConfidenceLabel(score);

  return {
    score,
    label,
    explanation: `예산 적합성, 필수 관광지 충족률, 숨은 비용 반영, 유류할증료 반영, 동선 효율을 합산해 ${score}점으로 계산했습니다.`,
    improvementSuggestions: buildImprovementSuggestions(input, score)
  };
}

function buildImprovementSuggestions(input: ExplainBookingConfidenceInput, score: number): string[] {
  const suggestions: string[] = [];

  if (input.totalCostKRW > input.budgetKRW) {
    suggestions.push("숙소 등급을 낮추거나 항공편을 LCC 시간대로 바꾸면 예산 내 진입 가능성이 큽니다.");
  }

  if (input.mustVisitCoverageRate < 1) {
    suggestions.push("필수 관광지 중 누락된 항목은 예약 가능한 액티비티 또는 무료 현장 방문 일정으로 보완하세요.");
  }

  if (input.routeEfficiencyScore < 70) {
    suggestions.push("숙소 위치를 필수 관광지와 같은 권역으로 조정하면 동선 효율이 올라갑니다.");
  }

  if (!input.hiddenCostIncluded || !input.fuelSurchargeIncluded) {
    suggestions.push("유류할증료, 현지 교통비, 식비, 예비비를 비용표에 포함해야 예약 판단 리스크가 낮아집니다.");
  }

  if (score >= 85) {
    suggestions.push("현재 조합은 예약 확신도가 높으므로 가격 변동 전에 항공권과 숙소를 먼저 확보하는 편이 좋습니다.");
  }

  return suggestions;
}
