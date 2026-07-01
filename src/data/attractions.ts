import type { Attraction } from "../types/travel.js";

export const attractions: Attraction[] = [
  { id: "usj", city: "osaka", name: "유니버설 스튜디오 재팬", aliases: ["usj", "universal studios japan"], priceKRW: 89000, averageVisitHours: 8, area: "베이 에어리어" },
  { id: "osaka-castle", city: "osaka", name: "오사카성", aliases: ["osaka castle"], priceKRW: 6000, averageVisitHours: 2, area: "오사카성 공원" },
  { id: "umeda-sky", city: "osaka", name: "우메다 스카이 빌딩", aliases: ["umeda sky"], priceKRW: 15000, averageVisitHours: 2, area: "우메다" },
  { id: "dotonbori", city: "osaka", name: "도톤보리", aliases: ["dotonbori"], priceKRW: 0, averageVisitHours: 2, area: "난바" },
  { id: "tokyo-disneyland", city: "tokyo", name: "도쿄 디즈니랜드", aliases: ["tokyo disneyland", "disneyland"], priceKRW: 94000, averageVisitHours: 8, area: "마이하마" },
  { id: "shibuya-sky", city: "tokyo", name: "시부야 스카이", aliases: ["shibuya sky"], priceKRW: 22000, averageVisitHours: 2, area: "시부야" },
  { id: "tokyo-skytree", city: "tokyo", name: "도쿄 스카이트리", aliases: ["tokyo skytree", "skytree"], priceKRW: 28000, averageVisitHours: 2, area: "오시아게" },
  { id: "sensoji", city: "tokyo", name: "센소지", aliases: ["sensoji"], priceKRW: 0, averageVisitHours: 2, area: "아사쿠사" },
  { id: "fukuoka-tower", city: "fukuoka", name: "후쿠오카 타워", aliases: ["fukuoka tower"], priceKRW: 8000, averageVisitHours: 1.5, area: "모모치" },
  { id: "teamlab-fukuoka", city: "fukuoka", name: "팀랩 포레스트 후쿠오카", aliases: ["teamlab fukuoka", "teamlab forest"], priceKRW: 24000, averageVisitHours: 2, area: "페이페이돔" },
  { id: "ohori-park", city: "fukuoka", name: "오호리 공원", aliases: ["ohori park"], priceKRW: 0, averageVisitHours: 2, area: "오호리" },
  { id: "dazaifu", city: "fukuoka", name: "다자이후 텐만구", aliases: ["dazaifu"], priceKRW: 0, averageVisitHours: 3, area: "다자이후" }
];
