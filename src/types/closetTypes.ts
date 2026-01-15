export interface homeCloset {
  //홈 화면에서 나열하는 옷장들의 기본 정보. 아이디랑 이름만.
  closet_id: number;
  closet_name: string;
}

export interface clothing {
  clothing_id: number;
  temperature: number; // 추천 기온: 옷 하나 눌럿을 때 필요함
  weather: string; // 계절: 카테고리 화면에서 옷들을 정렬할 때 기준으로 필요함. 그리고 이거 변경할 수도 있어야 할 것 같으니까 옷 하나 눌렀을 때도 필요함
  color: string; // 색상: 카테고리 화면에서 옷들을 정렬할 때 기준으로 필요함. 그리고 이거 변경할 수도 있어야 할 것 같으니까 옷 하나 눌렀을 때도 필요함
  image: string;
  categorySub_id: number; // 카테고리 수정 기능이 있으면 필요함.
  section_id: number; // 옷장 안에서의 위치 수정 기능이 있으면 필요함.
}
