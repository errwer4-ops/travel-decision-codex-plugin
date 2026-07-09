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

“Travel Decision AI”는 일본 자유여행 준비자가 예약 직전에 항공권·숙소·관광지·유류할증료·식비를 한 번에 계산해 예약 가능한 플랜 3개와 예약 확신도를 돌려주는 MyRealTrip 연동형 Codex 플러그인입니다.

주요 사용자는 일본 자유여행을 준비하는 20~40대입니다. 막히는 지점은 일정을 다 짠 직후입니다. AI로 오사카 3박 4일 일정을 만들었지만 실제로 예약하려면 항공권 탭, 유류할증료 확인 사이트, 숙소 탭, 관광지 입장료 검색 탭을 동시에 열고 총비용을 직접 계산해야 합니다. “유류할증료가 항공권 가격에 포함된 건지 별도인지”, “예산 150만원에 USJ와 오사카성을 다 넣으면 얼마가 남는지”, “숙소를 한 단계 낮추면 예산 안에 들어오는지”가 한눈에 보이지 않아 결제 버튼 직전에서 멈춥니다. 이 플러그인은 출발일·귀국일·공항·인원·예산·필수 관광지를 입력받아 가성비형·균형형·만족도 우선형 세 플랜을 생성하고, 각 플랜의 7개 항목 비용표, 예산 충족 여부, 예약 확신도 점수(0~100점), 리스크, 조정 제안을 함께 반환해 예약 버튼을 누를 근거를 제공합니다. 현재 MVP는 오사카·도쿄·후쿠오카를 지원합니다.

### 2. 왜 이 문제를 선택했나요?

저는 여행을 좋아하지만 평소 한정된 시간과 자금으로 여행을 준비해야 하는 상황입니다. 그래서 갈 만한 여행을 계획하는 데 블로그, 인스타그램, 여행 플랫폼을 오가며 많은 시간을 써야 했고, 최종적으로 예산이 맞는지 확인하는 과정이 늘 번거로웠습니다. 저와 같은 불편함을 가진 사람이 많을 것이라 판단해 MyRealTrip 트랙을 선택했습니다.

문제의 핵심은 여행 계획 생성이 아닙니다. AI는 일정을 빠르게 만들어 주지만, 예약 단계에서는 여전히 유류할증료가 항공권에 포함됐는지, 숙소 요금이 1인 기준인지 1실 기준인지, 관광지 입장료를 더하면 예산을 얼마나 초과하는지를 직접 계산해야 합니다. MyRealTrip은 항공권·숙소·액티비티를 한 플랫폼에서 제공하는 구조를 갖추고 있습니다. 이 구조에 AI 판단 레이어를 결합하면 “이 조합으로 지금 예약해도 된다”는 확신을 줄 수 있다고 판단했습니다. 예산 초과 상황에서도 실패로 끝내지 않고 숙소·항공편·액티비티 중 어디를 조정하면 되는지를 알려주는 것이 이 문제를 선택한 핵심 이유입니다.

### 3. 플러그인은 어떻게 작동하나요?

플러그인은 MCP(Model Context Protocol) stdio 서버로 구현했습니다. Codex가 사용자 메시지를 받으면 세 가지 tool 중 상황에 맞는 것을 호출합니다.

plan_bookable_trip은 핵심 tool입니다. 출발일·귀국일·공항·인원·예산·필수 관광지를 입력받아 가성비형·균형형·만족도 우선형 세 플랜을 동시에 생성합니다. 각 플랜은 항공권·유류할증료·숙소·관광지 입장료·현지 교통비·식비·예비비(소계의 5%) 7개 항목을 합산해 총비용을 계산합니다. 예산 충족 여부, 0~100점 예약 확신도, 리스크, 조정 제안이 함께 반환됩니다. estimate_trip_cost는 세 플랜 생성 없이 총비용과 유류할증료만 빠르게 추정할 때 씁니다. explain_booking_confidence는 확신도 점수가 낮은 이유와 개선 방법을 설명합니다.

정보가 부족하거나 지원하지 않는 노선이 입력되면 validators.ts에서 명시적 오류를 반환합니다. 관광지 이름이 데이터에 없을 경우 유사도 매칭을 시도하고, 매칭이 안 되면 도시 내 기본 관광지로 fallback 처리합니다. 유류할증료 데이터가 해당 월에 없으면 가장 최근 데이터를 사용하고 source 필드에 mock 출처를 명시합니다.

항공권·숙소·액티비티 검색은 서비스 레이어(services/myrealtrip.ts), 비용 계산은 라이브러리 레이어(lib/calculateCosts.ts)가 담당해 실제 API 교체 시 서비스 레이어만 수정하면 됩니다.

### 4. AI를 어떻게 썼나요?

Claude Code와 OpenAI Codex를 역할을 나눠 사용했습니다. 전체 아키텍처 설계, 예약 확신도 점수 산식 결정, 버그 원인 판단은 직접 했습니다. 코드 생성, 반복 수정, 테스트 작성은 AI에게 맡겼습니다.

막혔던 지점이 두 가지 있었습니다. 첫째, 항공편 필터에서 OR 조건 버그가 있었습니다. 출발 공항 조건에 ICN을 OR로 추가한 탓에 어떤 도시든 ICN 출발 항공편이 매칭됐습니다. Codex가 처음에는 다른 부분을 수정했는데, 원인을 직접 추적해 OR 조건을 제거하는 방향으로 다시 지시했습니다. 둘째, 3개 플랜이 모두 같은 호텔을 반환하는 문제가 있었습니다. 선호 지역 조건이 등급 조건보다 먼저 실행되어 발생한 버그였고, 등급 매칭을 우선하도록 로직 순서를 바꿔 해결했습니다.

거절한 AI 제안도 있었습니다. Codex가 activities 필드를 CostBreakdown에 유지하면서 항상 0을 반환하도록 제안했는데, 사용되지 않는 필드가 응답에 남으면 혼란을 줄 수 있어 타입과 계산 함수 모두에서 완전히 제거했습니다.

### 5. 어떻게 검증했나요?

Node.js 기반 smoke test 4개를 작성해 빌드 후 자동 실행합니다.

정상 케이스 예시: 오사카 3박 4일, ICN→KIX, 2명, 예산 150만원, 필수 관광지 유니버설 스튜디오 재팬·오사카성을 입력합니다. 반환값에서 city가 “오사카”, days가 4, nights가 3, plans 개수가 3인지 확인합니다. 관광지 입장료는 (89,000원+6,000원)×2=190,000원이어야 하고, 모든 플랜에 유류할증료와 bookingConfidenceScore가 포함돼야 합니다.

예외 케이스 확인: 예산 내 조건(총비용 90만원, 예산 100만원)으로 확신도를 계산하면 70점 이상이어야 하고, 예산 초과 조건(총비용 130만원, 예산 100만원, 관광지 커버리지 50%)의 점수는 반드시 낮아야 합니다. 이 두 케이스를 비교해 점수가 방향에 맞게 변하는지 검증합니다.

테스트하며 고친 점: 관광지 가격이 모두 0으로 반환되는 문제를 발견해 mock 데이터 가격을 실제 수준으로 수정했습니다. 도쿄 관광지 입장료 합계가 116,000원(디즈니랜드 94,000원+시부야스카이 22,000원)인지를 assertion으로 추가했습니다. 아직 부족한 점은 지원하지 않는 공항 코드 입력 시 오류 메시지가 영문이라는 것입니다.
