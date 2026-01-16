import * as closetRepository from '../repositories/closet.repository';
import { 
  SectionClothesResponseDto, 
  ClothingItemDto,
  ClosetSectionsViewResponseDto, 
  SectionViewItemDto 
} from '../dtos/closet.dto';
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

// 옷장 선택 시 섹션 뷰 조회
export const getClosetSectionsView = async (
  closetId: number,
  userId: number
): Promise<ClosetSectionsViewResponseDto> => {
  // 1. 옷장 존재 및 소유권 확인
  const closet = await closetRepository.findClosetWithTemplate(closetId, userId);
  if (!closet) {
    throw new Error('FORBIDDEN: 해당 옷장에 접근 권한이 없습니다.');
  }

  // 2. 옷장의 섹션 목록 조회
  const sections = await closetRepository.findSectionsByClosetId(closetId);

  // 3. DTO 변환
  const sectionItems: SectionViewItemDto[] = sections.map((section) => ({
    section_id: section.section_id,
    section_name: section.name, // 사용자가 지정한 별명
    section_type: section.sectionTemplate.section_type, // 템플릿 타입 (예: "행거", "서랍")
    clothing_count: section._count.clothings, // 해당 섹션에 포함된 옷 개수
  }));

  return {
    closet: {
      closet_id: closet.closet_id,
      closet_name: closet.closet_name,
      closet_type: closet.closetTemplate.template_name, // 옷장 템플릿 타입
    },
    sections: sectionItems,
    total_sections: sectionItems.length,
  };
};

// 섹션 속 옷 조회
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