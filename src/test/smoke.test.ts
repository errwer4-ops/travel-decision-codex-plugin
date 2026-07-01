import assert from "node:assert/strict";
import { estimateTripCost } from "../lib/calculateCosts.js";
import { calculateBookingConfidence } from "../lib/confidenceScore.js";
import { planBookableTrip } from "../lib/planGenerator.js";

const osakaInput = {
  departureDate: "2026-08-10",
  returnDate: "2026-08-13",
  departureAirport: "ICN" as const,
  arrivalAirport: "KIX" as const,
  travelers: 2,
  budgetKRW: 1500000,
  mustVisitAttractions: ["유니버설 스튜디오 재팬", "오사카성"],
  travelStyle: "balanced" as const,
  directFlightPreferred: true,
  preferredHotelArea: "난바"
};

const planned = planBookableTrip(osakaInput);
assert.equal(planned.city, "오사카");
assert.equal(planned.days, 4);
assert.equal(planned.nights, 3);
assert.equal(planned.plans.length, 3);
assert.equal(planned.plans[0].attractionCosts.reduce((sum, item) => sum + item.totalKRW, 0), 190000);
assert.ok(planned.plans.every((plan) => plan.costBreakdown.fuelSurcharge > 0));
assert.ok(planned.plans.every((plan) => plan.bookingConfidenceScore > 0));

const estimated = estimateTripCost({
  departureDate: "2026-08-10",
  returnDate: "2026-08-13",
  departureAirport: "ICN",
  arrivalAirport: "NRT",
  travelers: 1,
  budgetKRW: 1200000,
  mustVisitAttractions: ["도쿄 디즈니랜드", "시부야 스카이"],
  travelStyle: "balanced"
});
assert.ok(estimated.totalCostKRW > 0);
assert.equal(estimated.costBreakdown.attractionTickets, 116000);
assert.equal(estimated.fuelSurchargeSummary.included, true);

const confident = calculateBookingConfidence({
  totalCostKRW: 900000,
  budgetKRW: 1000000,
  mustVisitCoverageRate: 1,
  routeEfficiencyScore: 85,
  hiddenCostIncluded: true,
  fuelSurchargeIncluded: true,
  travelStyle: "balanced"
});
assert.ok(confident.score >= 70);

const overBudget = calculateBookingConfidence({
  totalCostKRW: 1300000,
  budgetKRW: 1000000,
  mustVisitCoverageRate: 0.5,
  routeEfficiencyScore: 45,
  hiddenCostIncluded: false,
  fuelSurchargeIncluded: false,
  travelStyle: "premium"
});
assert.ok(overBudget.score < confident.score);

console.log("Smoke tests passed.");
