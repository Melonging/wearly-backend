import * as outfitRepository from "../repositories/outfit.respository";
import {
  CategoryListDto,
  CategoryClothesResponseDto,
  ClothingItemDto,
} from "../dtos/outfit.dto";
import { Category } from "@prisma/client";

// 모든 카테고리 조회
export const getCategories = async (): Promise<CategoryListDto> => {
  const categories = await outfitRepository.getCategoryList();
  if (!categories || categories.length === 0) {
    throw new Error("NOT_FOUND: 카테고리 목록을 찾을 수 없습니다.");
  }

  return { categories };
};

// 선택한 카테고리의 모든 옷 조회
export const getCategoryClothes = async (
  categoryId: number,
  userId: number,
): Promise<CategoryClothesResponseDto> => {
  // 1. 조회
  const clothes = await outfitRepository.findClothesFromCategory(
    categoryId,
    userId,
  );

  if (!clothes || clothes.length === 0) {
    throw new Error("NOT_FOUND: 해당 카테고리의 옷을 찾을 수 없습니다.");
  }

  // 2. 각 옷 DTO 변환
  const clothingItems: ClothingItemDto[] = clothes.map((cloth) => ({
    clothing_id: cloth.clothing_id,
    image: cloth.image,
  }));

  return { clothes: clothingItems };
};
