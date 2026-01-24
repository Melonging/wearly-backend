import { ClothingItemDto } from "./closet.dto";

// 카테고리 하나의 정보
export interface CategoryInfoDto {
  category_id: number;
  name: string;
}
// 모든 카테고리 정보
export interface CategoryListDto {
  categories: CategoryInfoDto[];
}
// 한 카테고리 안에 들어있는 옷 정보
export interface CategoryClothesResponseDto {
  clothes: ClothingItemDto[];
  // total_count: number;
}
