import * as closetRepository from '../repositories/closet.repository';
import { SectionClothesResponseDto, ClothingItemDto } from '../dtos/closet.dto';
import {
  responseFromClosetsInfo,
  responseFromClothingInfo,
} from '../dtos/closet.dto';

export const getHomeClosets = async (userId: number) => {
  const closets = await closetRepository.getClosetsInfo(userId);
  if (!closets) {
    throw new Error("옷장 정보를 불러오는 데 실패했습니다.");
  }
  return responseFromClosetsInfo(closets);
};

export const viewClothing = async (clothingId: number) => {
  const clothing = await closetRepository.getClothingInfo(clothingId);
  if (!clothing) {
    throw new Error("옷 정보를 불러오는 데 실패했습니다.");
  }
  return responseFromClothingInfo(clothing);
};

export const getSectionClothes = async (
  sectionId: number,
  userId: number
): Promise<SectionClothesResponseDto> => {
  const hasOwnership = await closetRepository.checkSectionOwnership(sectionId, userId);
  if (!hasOwnership) {
    throw new Error('FORBIDDEN: 해당 섹션에 접근 권한이 없습니다.');
  }

  const section = await closetRepository.findSectionWithCloset(sectionId);
  if (!section) {
    throw new Error('NOT_FOUND: 섹션을 찾을 수 없습니다.');
  }

  const clothes = await closetRepository.findClothesBySection(sectionId, userId);

  const clothingItems: ClothingItemDto[] = clothes.map((cloth) => ({
    clothing_id: cloth.clothing_id,
    image: cloth.image,
    category: cloth.categorySub.name,
    season: cloth.season,
    color: cloth.color,
    temperature: cloth.temperature,
    created_at: cloth.created_at,
  }));

  return {
    section: {
      section_id: section.section_id,
      name: section.name,
      closet_name: section.closet.closet_name,
    },
    clothes: clothingItems,
    total_count: clothingItems.length,
  };
};