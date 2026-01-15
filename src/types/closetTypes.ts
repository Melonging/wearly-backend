import { Season, Color } from "@prisma/client";

export interface homeCloset {
  //옷장 하나
  //홈 화면에서 나열하는 옷장들의 기본 정보. 아이디랑 이름만.
  closet_id: number;
  closet_name: string;
}

export interface clothing {
  //옷 하나
  clothing_id: number;
  temperature: number | null; // 추천 기온: 옷 하나 눌렀을 때 필요함
  season: Season; // 계절: 카테고리 화면에서 옷들을 정렬할 때 기준으로 필요함
  color: Color; // 색상: 카테고리 화면에서 옷들을 정렬할 때 기준으로 필요함
  image: string;
  categorySub_id: number; // 카테고리 수정 기능이 있으면 필요함.
  section_id: number; // 옷장 안에서의 위치 수정 기능이 있으면 필요함.
}
