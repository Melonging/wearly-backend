import * as outfitRepository from "../repositories/outfit.respository";
import { CategoryListDto } from "../dtos/outfit.dto";
import { Category } from "@prisma/client";

// 모든 카테고리 조회
export const getCategories = async (): Promise<CategoryListDto> => {
  const categories = await outfitRepository.getCategoryList();
  if (!categories || categories.length === 0) {
    throw new Error("NOT_FOUND: 카테고리 목록을 찾을 수 없습니다.");
  }

  return { categories };
};
