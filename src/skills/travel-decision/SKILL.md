---
name: travel-decision
description: Use this skill when a user wants to decide whether a Japan travel combination is ready to book, compare bookable trip plans, estimate total trip cost, or explain a booking confidence score.
---

# Travel Decision AI

## Purpose

This plugin is not a generic travel recommender or a simple budget calculator. It helps the user decide whether a specific travel combination is ready to book.

Use it when the user provides or asks for:

- travel dates
- departure and arrival airports
- number of travelers
- total budget
- required attractions
- booking confidence, budget risk, or trip cost

The plugin currently supports a mock-data MVP for Osaka, Tokyo, and Fukuoka.

## Tools

### plan_bookable_trip

Creates three bookable plans:

- budget
- balanced
- satisfaction

Input fields:

- `departureDate`: `YYYY-MM-DD`
- `returnDate`: `YYYY-MM-DD`
- `departureAirport`: supported airport code
- `arrivalAirport`: supported airport code
- `travelers`: number
- `budgetKRW`: number
- `mustVisitAttractions`: string array
- `travelStyle`: Optional. Always creates three plans (`budget`, `balanced`, `satisfaction`). This value is currently accepted for compatibility and does not change plan generation.
- `directFlightPreferred`: optional boolean
- `preferredHotelArea`: optional string

Output includes city, nights, days, and `plans`. Each plan includes total cost, budget status, remaining budget, booking confidence score, confidence label, reasons, risks, cost breakdown, selected flight, selected hotel, selected activities, attraction costs, and booking links.

Display guidance: when writing Markdown summaries, do not use the tilde character (`~`) before approximate prices. Some clients render paired tildes as strikethrough. Use `약 103만원` or `1,030,000원` instead of `~103만원`.

### estimate_trip_cost

Estimates total trip cost without generating all three recommendation plans.

Use it when the user asks “how much will this trip cost?” or wants budget feasibility only.

Output includes total cost, cost breakdown, budget status, remaining budget, hidden cost summary, and fuel surcharge summary.

Display guidance: use the returned `displayTotalCostKRW` and `displayRemainingBudgetKRW` fields when showing approximate prices. Do not write approximate prices with `~`.

### explain_booking_confidence

Explains why a booking confidence score is high or low.

Use it when the user asks why a plan is recommended, why a plan is risky, or how to improve a score.

## Example Prompt

“2026-08-10부터 2026-08-13까지 ICN에서 KIX로 2명이 오사카 여행을 가려고 합니다. 예산은 150만원이고 유니버설 스튜디오 재팬과 오사카성은 꼭 가고 싶습니다. 바로 예약해도 되는 플랜 3개를 추천해 주세요.”

## Limits

- Current data is mock data.
- The plugin does not claim to use live MyRealTrip inventory.
- Booking URLs are placeholder MyRealTrip URLs.
- Fuel surcharge data is mock user-held public-site-style data and can be replaced later.
- The MVP supports only Osaka, Tokyo, and Fukuoka routes.

## Data Policy

Use only mock or public-source-replaceable data in the current MVP. Do not imply that private MyRealTrip production data is being used.
