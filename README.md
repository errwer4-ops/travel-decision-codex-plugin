# Travel Decision Codex Plugin

Travel Decision Codex Plugin은 사용자가 여행 계획을 세운 뒤 마지막에 겪는 “지금 이 조합을 예약해도 될까?”라는 의사결정 문제를 해결하기 위한 해커톤 MVP입니다. 기존 웹앱 구현은 삭제하지 않고 보존했으며, 제출 규격에 맞춰 실행 가능한 Codex Plugin 구조를 `src/` 아래에 새로 구성했습니다.

## 문제 정의

사용자는 ChatGPT, Gemini, Claude 같은 AI로 여행 일정을 빠르게 만들 수 있지만, 실제 예약 단계에서는 여전히 항공권, 숙소, 관광지, 유류할증료, 교통비, 식비를 여러 탭에서 직접 비교합니다. 이 프로젝트는 여행 추천 자체보다 “이 조합이면 바로 예약해도 된다”는 구매 확신을 주는 AI 의사결정 도구를 목표로 합니다.

## 무엇을 언제 쓰는가

이 플러그인은 일본 자유여행을 준비하는 사용자가 예산 안에서 예약 가능한 조합을 비교하고 싶을 때 사용합니다. MVP는 오사카, 도쿄, 후쿠오카를 지원하며, 사용자가 날짜, 공항, 인원, 예산, 필수 관광지를 입력하면 3개의 예약 후보를 만들고 각 후보의 비용, 리스크, 확신도를 설명합니다.

## 어떻게 작동하는가

MCP 서버는 세 가지 tool을 제공합니다.

- `plan_bookable_trip`: 예약 가능한 여행 조합 3개를 생성합니다.
- `estimate_trip_cost`: 여행 조건만으로 예상 총비용을 계산합니다.
- `explain_booking_confidence`: 예약 확신도 점수와 개선 제안을 설명합니다.

각 플랜은 항공권, 숙소, 액티비티, 관광지 입장료, 유류할증료, 식비, 현지 교통비, 예비비를 합산하고 예산 충족 여부를 판단합니다. 결과에는 booking URL 필드가 포함되며 현재는 mock MyRealTrip URL을 사용합니다.

## AI 사용 방식

이 MVP에서 AI는 단순히 일정을 생성하는 역할이 아니라 예약 판단 근거를 구조화하는 역할을 합니다. 예산 적합성, 필수 관광지 충족률, 숨은 비용 반영 여부, 유류할증료 반영 여부, 동선 효율, 여행 성향 적합도를 점수화해 `bookingConfidenceScore`를 계산합니다. 예산 초과 시에는 “예산 초과”에서 멈추지 않고 숙소 변경, 항공편 변경, 액티비티 조정 같은 실행 가능한 해결책을 제안합니다.

## 제출 구조

```text
src/
  .codex-plugin/plugin.json
  skills/travel-decision/SKILL.md
  .mcp.json
  package.json
  tsconfig.json
  server.ts
  types/travel.ts
  data/
    attractions.ts
    fuelSurcharges.ts
    cityMapping.ts
    mockProducts.ts
  services/
    myrealtrip.ts
  lib/
    calculateDates.ts
    calculateCosts.ts
    confidenceScore.ts
    planGenerator.ts
    validators.ts
logs/
  README.md
README.md
```

## 실행 방법

제출용 플러그인은 `src/` 폴더 안에서 실행합니다.

```bash
cd src
npm install
npm run build
npm test
npm run start
```

PowerShell 실행 정책으로 `npm`이 막히면 `npm.cmd`를 사용합니다.

```bash
npm.cmd install
npm.cmd run build
npm.cmd test
```

## 테스트 입력 예시

```json
{
  "departureDate": "2026-08-10",
  "returnDate": "2026-08-13",
  "departureAirport": "ICN",
  "arrivalAirport": "KIX",
  "travelers": 2,
  "budgetKRW": 1500000,
  "mustVisitAttractions": ["유니버설 스튜디오 재팬", "오사카성"],
  "travelStyle": "balanced",
  "directFlightPreferred": true,
  "preferredHotelArea": "난바"
}
```

검증 기준:

- city는 `오사카`
- days는 `4`
- nights는 `3`
- plans는 `3개`
- 관광지 입장료는 `(89,000 + 6,000) x 2 = 190,000원`
- 유류할증료가 비용에 포함됨
- bookingConfidenceScore가 계산됨

## Mock 데이터 설명

현재는 실제 MyRealTrip API를 호출하지 않습니다. 모든 항공권, 숙소, 액티비티는 `src/data/mockProducts.ts`에 정의된 mock 상품입니다. 유류할증료는 `src/data/fuelSurcharges.ts`에 분리되어 있으며, `source`는 `mock:user-fuel-surcharge-site`로 명시했습니다. 이 구조는 향후 MyRealTrip 항공권, 숙소, 액티비티 API와 사용자 보유 유류할증료 데이터로 교체하기 쉽도록 service와 data 계층을 분리한 것입니다.

## 검증 결과

다음 명령을 실행해 검증했습니다.

```bash
cd src
npm.cmd install
npm.cmd run build
npm.cmd test
```

결과:

- `npm.cmd install`: 성공, 취약점 0개
- `npm.cmd run build`: TypeScript 컴파일 성공
- `npm.cmd test`: `Smoke tests passed.`

참고: plugin-creator의 Python validator는 이 PC에서 `python`, `python3`, `py` 명령이 응답하지 않아 실행하지 못했습니다. 대신 manifest는 Codex plugin 스펙 샘플을 기준으로 작성했고, Node 기반 제출 검증은 통과했습니다.

## 향후 연동 계획

- `services/myrealtrip.ts`의 mock 검색 함수를 실제 MyRealTrip 항공권, 숙소, 액티비티 API adapter로 교체
- `data/fuelSurcharges.ts`를 사용자 보유 공개 사이트 기반 유류할증료 데이터로 갱신
- 환율 데이터와 현지 결제 수수료 반영
- 실제 재고, 취소 정책, 무료 취소 여부, 객실 타입까지 확신도 산식에 반영

## 해커톤 제출용 5문항 답변 초안

### 1. 무엇을 누가 어떤 상황에서 쓰나요?

이 플러그인은 일본 자유여행을 준비하는 20~40대 사용자가 예약 직전에 사용합니다. 사용자는 이미 AI로 대략적인 일정을 만들었지만 항공권, 숙소, 액티비티, 유류할증료, 교통비를 여러 탭에서 비교하며 확신을 얻지 못한 상태입니다. 이때 날짜, 공항, 인원, 예산, 필수 관광지를 입력하면 Codex Plugin이 예약 가능한 조합 3개와 확신도, 리스크, 조정 제안을 반환합니다.

### 2. 왜 이 문제를 선택했나요?

여행 계획 생성은 이미 많은 AI 서비스가 잘 해결하고 있지만, 실제 구매 단계의 불안은 남아 있습니다. 사용자는 “좋은 일정”보다 “이 가격과 구성으로 지금 예약해도 되는가”를 알고 싶어 합니다. 그래서 단순 추천이나 예산표가 아니라 항공권, 숙소, 액티비티, 유류할증료, 숨은 비용을 함께 판단해 예약 버튼을 누를 근거를 주는 문제를 선택했습니다.

### 3. 플러그인은 어떻게 작동하나요?

MCP 서버는 `plan_bookable_trip`, `estimate_trip_cost`, `explain_booking_confidence` 세 가지 tool을 제공합니다. 핵심 tool은 사용자 입력을 받아 가성비형, 균형형, 만족도 우선형 플랜을 생성합니다. 각 플랜은 총비용, 예산 상태, 남는 예산, 필수 관광지 충족 여부, 비용표, 예약 후보, 리스크, 추천 이유를 포함합니다. 현재 상품과 가격은 mock 데이터이며 실제 API로 교체 가능한 구조입니다.

### 4. AI를 어떻게 썼나요?

AI는 여행지를 막연히 추천하는 역할이 아니라 구매 의사결정 기준을 구조화하는 역할로 사용했습니다. 예산 적합성, 필수 관광지 충족률, 숨은 비용 포함 여부, 유류할증료 포함 여부, 동선 효율, 여행 성향 적합도를 점수화해 booking confidence를 계산합니다. 또한 예산 초과 시에는 단순히 실패로 표시하지 않고 숙소 변경, 항공편 변경, 액티비티 조정 같은 구체적 해결책을 제시하도록 설계했습니다.

### 5. 어떻게 검증했나요?

오사카 3박 4일, ICN-KIX, 2명, 예산 150만원, 필수 관광지 유니버설 스튜디오 재팬과 오사카성 조건으로 smoke test를 작성했습니다. 테스트는 city, days, nights, plans 개수, 관광지 입장료 190,000원, 유류할증료 포함 여부, bookingConfidenceScore 계산 여부를 검증합니다. 추가로 도쿄 비용 추정과 예산 내/초과 확신도 계산을 비교해 점수가 합리적으로 변하는지 확인했습니다.
