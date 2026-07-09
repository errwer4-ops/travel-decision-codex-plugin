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

## 해커톤 제출용 5문항 답변

### 1. 무엇을 누가 어떤 상황에서 쓰나요?

이 플러그인은 일본 자유여행을 준비하는 사용자가 예약 직전 단계에서 사용하는 의사결정 도구입니다. 구체적인 사용 상황은 이렇습니다. ChatGPT나 Claude로 오사카 3박 4일 일정을 이미 만들었습니다. 그런데 막상 예약하려면 항공권 가격 비교 탭, 숙소 예약 탭, 유류할증료 확인 탭, 관광지 입장료 탭을 따로 열어야 합니다. 총비용이 예산 안에 들어오는지, 필수로 가고 싶은 곳을 다 넣어도 되는지 한눈에 확인이 안 됩니다. 이 플러그인은 출발일, 귀국일, 공항 코드, 인원, 예산, 꼭 가고 싶은 관광지를 입력하면 가성비형·균형형·만족도 우선형 세 가지 예약 후보를 만들어 각각의 총비용, 예산 충족 여부, 유류할증료, 숨은 비용, 예약 확신도, 리스크, 조정 제안을 함께 돌려줍니다. 현재 MVP는 오사카·도쿄·후쿠오카를 지원하며, 항공권·숙소·액티비티는 MyRealTrip 상품 구조를 기반으로 한 mock 데이터로 구성했습니다.

### 2. 왜 이 문제를 선택했나요?

여행 일정 생성은 AI가 이미 잘 해결하고 있습니다. 문제는 그 다음 단계입니다. 일정은 있는데 예약 버튼을 누르지 못하는 이유는 정보가 흩어져 있고 총비용 계산이 번거롭기 때문입니다. 항공권 가격에 유류할증료가 포함됐는지, 숙소 요금이 1인 기준인지 1실 기준인지, 관광지 입장료를 더하면 예산을 얼마나 초과하는지를 직접 계산해야 합니다. MyRealTrip은 항공권·숙소·액티비티를 한 플랫폼에서 제공하는 구조입니다. 이 구조를 AI 판단 레이어와 결합하면 “이 조합으로 지금 예약해도 된다”는 확신을 줄 수 있다고 판단했습니다. 단순 예산 계산기가 아니라 예약 가능한 조합을 비교하고 확신도를 점수로 제시하는 방향을 선택한 이유입니다. 예산 초과 상황에서도 실패로 끝내지 않고 숙소 변경·항공편 변경·액티비티 조정 중 어디를 바꾸면 되는지를 알려주는 것이 핵심 차별점입니다.

### 3. 플러그인은 어떻게 작동하나요?

플러그인은 MCP(Model Context Protocol) stdio 서버로 구현했습니다. Codex가 사용자 요청을 받으면 세 가지 tool 중 하나를 호출합니다. plan_bookable_trip은 핵심 tool로, 입력값을 받아 가성비형·균형형·만족도 우선형 세 플랜을 동시에 생성합니다. 각 플랜은 항공권·유류할증료·숙소·관광지 입장료·현지 교통비·식비·예비비(5%) 7개 항목을 합산해 총비용을 계산합니다. estimate_trip_cost는 세 플랜 생성 없이 총비용만 빠르게 추정할 때 씁니다. explain_booking_confidence는 확신도 점수가 왜 낮은지, 어떻게 올릴 수 있는지를 설명합니다. 항공권·숙소·액티비티 검색은 서비스 레이어(services/myrealtrip.ts)가 담당하고, 비용 계산은 라이브러리 레이어(lib/calculateCosts.ts)가 담당합니다. 이 구조는 mock 데이터를 실제 MyRealTrip API로 교체할 때 서비스 레이어만 수정하면 되도록 설계했습니다.

### 4. AI를 어떻게 썼나요?

이 플러그인에서 AI의 역할은 여행지를 추천하는 것이 아니라 예약 판단 기준을 점수로 구조화하는 것입니다. 핵심은 booking confidence score입니다. 예산 적합도(최대 40점), 필수 관광지 충족률(최대 20점), 숨은 비용 반영 여부(최대 15점), 유류할증료 반영 여부(최대 10점), 동선 효율(최대 10점), 여행 성향 적합도(최대 5점)를 합산해 100점 만점으로 계산합니다. 예산 범위에 따라 점수 가중치가 달라집니다. 예산 90% 이내면 예산 적합도를 만점으로 주고, 90~100% 구간이면 부분 점수를 줍니다. 이 점수와 함께 confidenceLabel(매우 높음·높음·보통·낮음)과 개선 제안을 함께 반환합니다. 예산 초과 플랜에는 초과 금액과 “숙소 변경, 항공편 변경, 액티비티 조정 중 하나를 선택하면 예산 내 가능성이 높아집니다”라는 실행 가능한 다음 단계를 제시합니다. Claude Code와 OpenAI Codex를 사용해 구조 설계, 버그 수정, 테스트 작성을 진행했습니다.

### 5. 어떻게 검증했나요?

Node.js 기반 smoke test를 작성해 빌드 후 자동 실행합니다. 총 4개 케이스를 검증합니다. 첫째, 오사카 3박 4일, ICN-KIX, 2명, 예산 150만원, 필수 관광지 유니버설 스튜디오 재팬(89,000원)·오사카성(6,000원) 조건으로 plan_bookable_trip을 호출해 city·days·nights·plans 개수, 관광지 입장료 합계 190,000원, 유류할증료 포함 여부, bookingConfidenceScore 계산 여부를 확인합니다. 둘째, 도쿄 ICN-NRT 1명 조건으로 estimate_trip_cost를 호출해 총비용 양수 여부, 관광지 입장료(디즈니랜드 94,000원+시부야스카이 22,000원=116,000원), 유류할증료 포함 여부를 확인합니다. 셋째와 넷째, explain_booking_confidence에 예산 내 케이스와 예산 초과 케이스를 각각 넣어 예산 내 점수가 70점 이상이고 예산 초과 점수가 더 낮은지 비교합니다. npm run build && npm test 실행 결과 TypeScript 컴파일 오류 없이 “Smoke tests passed.”가 출력됩니다.
