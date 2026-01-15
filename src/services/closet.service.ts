import * as closetRepository from '../repositories/closet.repository';
import { SectionClothesResponseDto, ClothingItemDto } from '../dtos/closet.dto';

//섹션에 속한 모든 옷 조회 
export const getSectionClothes = async (
  sectionId: number,
  userId: number
): Promise<SectionClothesResponseDto> => {
  // 1. 섹션 소유 권한 확인
  const hasOwnership = await closetRepository.checkSectionOwnership(sectionId, userId);
  if (!hasOwnership) {
    throw new Error('FORBIDDEN: 해당 섹션에 접근 권한이 없습니다.');
  }

  // 2. 섹션 정보 조회
  const section = await closetRepository.findSectionWithCloset(sectionId);
  if (!section) {
    throw new Error('NOT_FOUND: 섹션을 찾을 수 없습니다.');
  }

  // 3. 섹션 속 옷들 조회
  const clothes = await closetRepository.findClothesBySection(sectionId, userId);

  // 4. DTO 변환
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