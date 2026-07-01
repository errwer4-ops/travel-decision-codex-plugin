import type { ActivityOffer, FlightOffer, HotelOffer } from "../types/travel.js";

export const mockFlights: FlightOffer[] = [
  { id: "flight-osaka-budget", title: "오사카 LCC 직항", airline: "Mock Air", departureAirport: "ICN", arrivalAirport: "KIX", direct: true, priceKRW: 288000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "flight-osaka-balanced", title: "오사카 낮 출발 직항", airline: "Mock Air", departureAirport: "ICN", arrivalAirport: "KIX", direct: true, priceKRW: 320000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "flight-osaka-premium", title: "오사카 풀서비스 직항", airline: "Mock Air", departureAirport: "ICN", arrivalAirport: "KIX", direct: true, priceKRW: 432000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "flight-tokyo-budget", title: "도쿄 LCC 직항", airline: "Mock Air", departureAirport: "ICN", arrivalAirport: "NRT", direct: true, priceKRW: 342000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "flight-tokyo-balanced", title: "도쿄 낮 출발 직항", airline: "Mock Air", departureAirport: "ICN", arrivalAirport: "HND", direct: true, priceKRW: 380000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "flight-tokyo-premium", title: "도쿄 풀서비스 직항", airline: "Mock Air", departureAirport: "GMP", arrivalAirport: "HND", direct: true, priceKRW: 513000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "flight-fukuoka-budget", title: "후쿠오카 LCC 직항", airline: "Mock Air", departureAirport: "PUS", arrivalAirport: "FUK", direct: true, priceKRW: 234000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "flight-fukuoka-balanced", title: "후쿠오카 낮 출발 직항", airline: "Mock Air", departureAirport: "ICN", arrivalAirport: "FUK", direct: true, priceKRW: 260000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "flight-fukuoka-premium", title: "후쿠오카 풀서비스 직항", airline: "Mock Air", departureAirport: "ICN", arrivalAirport: "FUK", direct: true, priceKRW: 351000, bookingUrl: "https://www.myrealtrip.com" }
];

export const mockHotels: HotelOffer[] = [
  { id: "hotel-osaka-budget", title: "난바 비즈니스 호텔", city: "osaka", area: "난바", rating: 4.1, pricePerNightKRW: 67500, bookingUrl: "https://www.myrealtrip.com" },
  { id: "hotel-osaka-balanced", title: "신사이바시 시티 호텔", city: "osaka", area: "신사이바시", rating: 4.5, pricePerNightKRW: 90000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "hotel-osaka-premium", title: "우메다 프리미어 호텔", city: "osaka", area: "우메다", rating: 4.8, pricePerNightKRW: 162000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "hotel-tokyo-budget", title: "우에노 스테이션 호텔", city: "tokyo", area: "우에노", rating: 4.0, pricePerNightKRW: 90000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "hotel-tokyo-balanced", title: "신주쿠 커넥트 호텔", city: "tokyo", area: "신주쿠", rating: 4.5, pricePerNightKRW: 120000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "hotel-tokyo-premium", title: "긴자 프리미어 스테이", city: "tokyo", area: "긴자", rating: 4.8, pricePerNightKRW: 216000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "hotel-fukuoka-budget", title: "하카타 컴팩트 호텔", city: "fukuoka", area: "하카타", rating: 4.1, pricePerNightKRW: 60000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "hotel-fukuoka-balanced", title: "텐진 라이프스타일 호텔", city: "fukuoka", area: "텐진", rating: 4.5, pricePerNightKRW: 80000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "hotel-fukuoka-premium", title: "모모치 베이 리조트", city: "fukuoka", area: "모모치", rating: 4.7, pricePerNightKRW: 144000, bookingUrl: "https://www.myrealtrip.com" }
];

export const mockActivities: ActivityOffer[] = [
  { id: "activity-usj", title: "유니버설 스튜디오 재팬 1일권", city: "osaka", attractionName: "유니버설 스튜디오 재팬", priceKRW: 89000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "activity-osaka-castle", title: "오사카성 입장권", city: "osaka", attractionName: "오사카성", priceKRW: 6000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "activity-umeda-sky", title: "우메다 스카이 빌딩 전망대", city: "osaka", attractionName: "우메다 스카이 빌딩", priceKRW: 15000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "activity-disneyland", title: "도쿄 디즈니랜드 1일 패스", city: "tokyo", attractionName: "도쿄 디즈니랜드", priceKRW: 94000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "activity-shibuya-sky", title: "시부야 스카이 입장권", city: "tokyo", attractionName: "시부야 스카이", priceKRW: 22000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "activity-skytree", title: "도쿄 스카이트리 전망대", city: "tokyo", attractionName: "도쿄 스카이트리", priceKRW: 28000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "activity-fukuoka-tower", title: "후쿠오카 타워 전망대", city: "fukuoka", attractionName: "후쿠오카 타워", priceKRW: 8000, bookingUrl: "https://www.myrealtrip.com" },
  { id: "activity-teamlab-fukuoka", title: "팀랩 포레스트 후쿠오카", city: "fukuoka", attractionName: "팀랩 포레스트 후쿠오카", priceKRW: 24000, bookingUrl: "https://www.myrealtrip.com" }
];
