import { Season, Color } from '@prisma/client';

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