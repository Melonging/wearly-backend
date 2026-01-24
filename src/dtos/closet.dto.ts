// 홈 화면 옷장 목록 조회 - 옷장 하나의 정보
export interface HomeClosetDto {
  closet_id: number;
  closet_name: string;
}

// 홈 화면 옷장 목록 조회 응답 (배열)
export type ClosetsInfoResponseDto = HomeClosetDto[];

// 옷장 섹션 뷰 응답 (옷장 선택 시 보여지는 화면)
export interface ClosetSectionsViewResponseDto {
  closet: {
    closet_id: number;
    closet_name: string;
    closet_type: string; // 옷장 템플릿 타입
  };
  sections: SectionViewItemDto[];
  total_sections: number;
}

export interface SectionViewItemDto {
  section_id: number;
  section_name: string; // 섹션 별명
  section_type: string; // 섹션 타입 (예: "행거", "서랍", "아우터")
  clothing_count: number; // 섹션에 포함된 옷의 개수
}

// 섹션 속 옷 조회 응답
export interface SectionClothesResponseDto {
  section: {
    section_id: number;
    name: string;
    closet_name: string;
  };
  clothes: ClothingItemDto[];
  total_count: number;
}

export interface ClothingItemDto {
  //섹션 속 옷 조회에서 필요한 옷 하나
  clothing_id: number;
  image: string;
  category: string; // CategorySub의 name
  temperature: number | null;
  created_at: Date;
}

export interface ClothingInfoResponseDto {
  //옷 상세 조회에서 필요한 옷 하나 //위에거랑 통일해야 하나?
  clothing_id: number;
  temperature: number | null; // 추천 기온: 옷 하나 눌렀을 때 필요함
  image: string;
  category_id: number; // 카테고리 수정 기능이 있으면 필요함.
  section_id: number; // 옷장 안에서의 위치 수정 기능이 있으면 필요함.
}
