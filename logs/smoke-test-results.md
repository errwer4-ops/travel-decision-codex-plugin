# Smoke Test Results

**Run date:** 2026-06-29  
**Command:** `npm.cmd run build && npm.cmd test`  
**Result:** PASSED

## Test Cases

### 1. plan_bookable_trip - 오사카 3박 4일 2명

Input:

- departureDate: 2026-08-10
- returnDate: 2026-08-13
- departureAirport: ICN
- arrivalAirport: KIX
- travelers: 2
- budgetKRW: 1,500,000
- mustVisitAttractions: ["유니버설 스튜디오 재팬", "오사카성"]
- travelStyle: balanced

Assertions:

- `planned.city === "오사카"`
- `planned.days === 4`
- `planned.nights === 3`
- `planned.plans.length === 3`
- attraction ticket total is `190,000 KRW`
- every plan includes fuel surcharge
- every plan has a booking confidence score

### 2. estimate_trip_cost - 도쿄 1명

Input:

- departureAirport: ICN
- arrivalAirport: NRT
- travelers: 1
- budgetKRW: 1,200,000
- mustVisitAttractions: ["도쿄 디즈니랜드", "시부야 스카이"]
- travelStyle: balanced

Assertions:

- `estimated.totalCostKRW > 0`
- `estimated.costBreakdown.attractionTickets === 116000`
- `estimated.fuelSurchargeSummary.included === true`

### 3. explain_booking_confidence - within budget case

Input:

- totalCostKRW: 900,000
- budgetKRW: 1,000,000
- mustVisitCoverageRate: 1.0
- routeEfficiencyScore: 85
- hiddenCostIncluded: true
- fuelSurchargeIncluded: true

Assertion:

- `score >= 70`

### 4. explain_booking_confidence - over budget case

Input:

- totalCostKRW: 1,300,000
- budgetKRW: 1,000,000
- mustVisitCoverageRate: 0.5
- routeEfficiencyScore: 45
- hiddenCostIncluded: false
- fuelSurchargeIncluded: false

Assertion:

- `overBudget.score < confident.score`

## Build Output

```text
> travel-decision-codex-plugin@0.1.0 build
> tsc -p tsconfig.json

> travel-decision-codex-plugin@0.1.0 test
> node dist/test/smoke.test.js

Smoke tests passed.
```

## Summary

All smoke tests passed after fixing activity prices, removing the unused `activities` cost field, making `plan_bookable_trip.travelStyle` optional, verifying Tokyo attraction tickets are included in `estimate_trip_cost`, and adding display formatting guidance to avoid Markdown strikethrough from `~` price prefixes.
