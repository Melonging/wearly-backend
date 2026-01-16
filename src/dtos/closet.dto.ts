import { homeCloset, clothing } from "../types/closetTypes";
import { Season, Color } from '@prisma/client';

//홈 조회
export const responseFromClosetsInfo = (closets: homeCloset[]) => {
  return {
    success: true,
    data: closets,
    error: null,
  };
};

//옷 조회
export const responseFromClothingInfo = (clothing: clothing) => {
  return {
    success: true,
    data: clothing,
    error: null,
  };
};

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
  clothing_id: number;
  image: string;
  category: string; // CategorySub의 name
  season: Season;
  color: Color;
  temperature: number | null;
  created_at: Date;
}